const bcrypt = require('bcryptjs');
const hash = '$2b$12$3u/M3AXDwHDxZuzfrwDd1eXbKn/JZJGjCqU9HDXp2JXJg6pO09cjq';
bcrypt.compare('admin123', hash).then(res => console.log('Match admin123:', res));
bcrypt.compare('123456', hash).then(res => console.log('Match 123456:', res));
