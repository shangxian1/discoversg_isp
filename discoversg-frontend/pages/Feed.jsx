import Header from "../components/Header"
import Footer from "../components/Footer"
import { Grid } from '@mui/material';

function Feed() {
  return <>
    <Header></Header>
    <Grid container spacing={2}>
      <Grid size={5}>
        <h1 className="text-sm">Test</h1>
      </Grid>

      <Grid size={7}>
       <h1 className="w-100">Testing</h1>
      </Grid>
    </Grid>
    <Footer></Footer>
  </>
}

export default Feed