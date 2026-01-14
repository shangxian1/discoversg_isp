import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Chip,
  CardActionArea,
  Container,
  CircularProgress,
  Stack,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";

const priceLabel = (price) => {
  const n = Number(price);
  if (!Number.isFinite(n) || n <= 0) return "Free";
  return `$${n.toFixed(2)}`;
};

function GemCard({ item }) {
  const navigate = useNavigate();

  const handleNavigate = () => {
    console.log("Navigating with item:", item);
    const mappedState = {
      activityName: item.activityName,
      categoryName: item.categoryName || item.category || "Activity",
      location: item.location,
      address: item.address,
      summary: item.summary,
      description: item.description,
      price: item.price,
      finalImage: `/assets/${item.image}`
    };

    
    navigate(`/activity/${item.activityID}`, { state: mappedState });
  };

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        borderRadius: 3,
        overflow: "hidden",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        transition: "transform .15s ease, box-shadow .15s ease",
        "&:hover": { transform: "translateY(-2px)", boxShadow: 6 },
      }}
    >
      <CardActionArea
        onClick={handleNavigate}
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
        }}
      >
        <Box sx={{ width: "100%", position: "relative" }}>
          <CardMedia
            component="img"
            image={
              item.image
                ? `/assets/${item.image}` // ✅ served from frontend public/assets
                : "https://placehold.co/600x400?text=No+Image"
            }
            alt={item.title}
            sx={{
              width: "100% !important",
              height: "200px",
              objectFit: "cover",
              display: "block",
              margin: "0 auto",
            }}
          />
        </Box>

        <CardContent sx={{ flexGrow: 1, p: 2 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 1 }}
          >
            <Chip
              label={item.category || "Activity"}
              size="small"
              variant="outlined"
              sx={{ fontWeight: "bold" }}
            />
            <Chip
              label={priceLabel(item.price)}
              size="small"
              sx={{ fontWeight: "bold", bgcolor: "rgba(211,17,17,0.08)" }}
            />
          </Stack>

          <Typography
            variant="h6"
            sx={{ fontWeight: 700, fontSize: "1.05rem", lineHeight: 1.2, mb: 1 }}
          >
            {item.title}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", color: "text.secondary" }}>
            <LocationOnIcon sx={{ fontSize: 16, mr: 0.5, color: "#d31111" }} />
            <Typography variant="body2" noWrap sx={{ maxWidth: "100%" }}>
              {item.location || "Singapore"}
            </Typography>
          </Box>

          {item.summary && (
            <Typography variant="body2" sx={{ mt: 1, opacity: 0.85 }}>
              {item.summary}
            </Typography>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default function ContentSection() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const offers = useMemo(
    () => activities.filter((a) => Number(a.price) === 0 || Number(a.price) <= 15).slice(0, 4),
    [activities]
  );

  const featured = useMemo(() => activities.slice(0, 6), [activities]);

  useEffect(() => {
    let alive = true;

    async function load() {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:3000/api/activities");
        if (!res.ok) throw new Error(`API error ${res.status}`);
        const data = await res.json();
        if (alive) setActivities(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Home activities fetch failed:", e);
        if (alive) setActivities([]);
      } finally {
        if (alive) setLoading(false);
      }
    }

    load();
    return () => {
      alive = false;
    };
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 900 }}>
        Offers
      </Typography>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3} sx={{ mb: 5 }}>
          {offers.map((item) => (
            <Grid key={item.activityID} item xs={12} sm={6} md={3} sx={{ display: "flex" }}>
              <GemCard item={item} />
            </Grid>
          ))}
        </Grid>
      )}

      <Typography variant="h5" sx={{ mb: 2, fontWeight: 900 }}>
        Featured
      </Typography>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {featured.map((item) => (
            <Grid key={item.activityID} item xs={12} sm={6} md={4} sx={{ display: "flex" }}>
              <GemCard item={item} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}
