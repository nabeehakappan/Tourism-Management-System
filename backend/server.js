const express = require('express');
const cors = require('cors');

const touristRoutes = require('./routes/tourists');
const packageRoutes = require('./routes/packages');
const guideRoutes = require('./routes/guides');
const bookingRoutes = require('./routes/bookings');
const reviewRoutes = require('./routes/reviews');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/tourists', touristRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/guides', guideRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);

const PORT = 5000;

app.get('/', (req, res) => {
    res.json({
        message: 'TRAVELIA backend is connected to Oracle!'
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});