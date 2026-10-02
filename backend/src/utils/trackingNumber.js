/**
 * Generates a unique tracking number with format: SST-YYYYMMDD-XXXXX
 */
function generateTrackingNumber() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const dateStr = `${year}${month}${day}`;
  
  const randomDigits = Math.floor(10000 + Math.random() * 90000);
  return `SST-${dateStr}-${randomDigits}`;
}

module.exports = { generateTrackingNumber };
