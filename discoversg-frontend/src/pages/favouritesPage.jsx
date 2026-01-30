import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  CardActionArea,
  Stack,
  CircularProgress,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { BACKEND_URL } from "../constants";

const priceLabel = (price) => {
  const n = Number(price);
  if (!Number.isFinite(n) || n <= 0) return "Free";
  return `$${n.toFixed(2)}`;
};

function GemCard({ item }) {
  const navigate = useNavigate();

  const activityId = item.id || item.activityID;

  const imageUrl =
    item.image && item.image !== "_"
      ? item.image.startsWith("http")
        ? item.image
        : `/assets/${item.image}`
      : item.activityPicUrl
      ? `/assets/${item.activityPicUrl}`
      : "https://placehold.co/600x400?text=No+Image";

  const title = item.title || item.activityName;
  const category = item.category || item.categoryName || "Activity";

  const handleNavigate = () => {
    const mappedState = {
      activityName: item.activityName || item.title,
      categoryName: item.categoryName || item.category || "Activity",
      location: item.location || "Singapore",
      address: item.address || "",
      summary: item.summary || "",
      description: item.description || "",
      price: item.price || 0,
      finalImage: imageUrl,
    };

    navigate(`/activity/${activityId}`, { state: mappedState });
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
            image={imageUrl}
            alt={title}
            sx={{ width: "100% !important", height: "200px", objectFit: "cover" }}
          />
        </Box>

        <CardContent sx={{ flexGrow: 1, p: 2 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
            <Chip label={category} size="small" variant="outlined" sx={{ fontWeight: "bold" }} />
            <Chip
              label={priceLabel(item.price)}
              size="small"
              sx={{ fontWeight: "bold", bgcolor: "rgba(211,17,17,0.08)" }}
            />
          </Stack>

          <Typography variant="h6" sx={{ fontWeight: 700, fontSize: "1.05rem", mb: 1 }}>
            {title}
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

export default function Favourites() {
  const user = JSON.parse(sessionStorage.getItem("user"));

  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);

 useEffect(() => {
  let alive = true;

  async function loadFavs() {
    const userId = user?.id ?? user?.userID;
    if (!userId) {
      if (alive) {
        setItems([]);
        setLoading(false);
      }
      return;
    }

    try {
      setLoading(true);

      // 1) get favourite activity IDs
      const idsRes = await fetch(`${BACKEND_URL}/api/favourites/${userId}/ids`);
      if (!idsRes.ok) throw new Error(`Fav IDs API error ${idsRes.status}`);
      const favIdsArr = await idsRes.json();
      const favSet = new Set(Array.isArray(favIdsArr) ? favIdsArr : []);

      // if no favourites, stop early
      if (favSet.size === 0) {
        if (alive) setItems([]);
        return;
      }

      // 2) get all activities
      const actsRes = await fetch(`${BACKEND_URL}/api/activities`);
      if (!actsRes.ok) throw new Error(`Activities API error ${actsRes.status}`);
      const activities = await actsRes.json();

      // 3) filter to favourites
      const favActivities = (Array.isArray(activities) ? activities : []).filter((a) => {
        const id = a.id || a.activityID;
        return favSet.has(id);
      });

      if (alive) setItems(favActivities);
    } catch (e) {
      console.error("Favourites fetch failed:", e);
      if (alive) setItems([]);
    } finally {
      if (alive) setLoading(false);
    }
  }

  loadFavs();
  return () => {
    alive = false;
  };
}, [user?.id, user?.userID]);


  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 3, color: "#196f75" }}>
        My Favourites ❤️
      </Typography>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      ) : items.length === 0 ? (
        <Typography color="text.secondary">
          No favourites yet. Tap the ❤️ on an activity to save it!
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {items.map((item) => (
            <Grid key={item.id || item.activityID} item xs={12} sm={6} md={4} sx={{ display: "flex" }}>
              <GemCard item={item} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}