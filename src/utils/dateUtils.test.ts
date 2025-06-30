// Simple test file to verify timezone conversion functions
// This can be run manually to test the functions

import { 
  convertLocalToSingaporeTime, 
  formatDateOnlyToSingaporeTime, 
  formatTimeRemainingInSingaporeTime,
  getCurrentSingaporeTimeISO 
} from './dateUtils';

// Test the conversion function
function testTimezoneConversion() {
  console.log('=== Testing Singapore Timezone Conversion ===');
  
  // Test 1: Convert local date/time to Singapore time
  const localDate = '2024-12-25';
  const localTime = '14:30';
  const singaporeTime = convertLocalToSingaporeTime(localDate, localTime);
  console.log(`Local: ${localDate} ${localTime}`);
  console.log(`Singapore: ${singaporeTime}`);
  console.log(`Expected: 2024-12-25T06:30:00.000Z (8 hours ahead)`);
  console.log('');
  
  // Test 2: Format a UTC date to Singapore timezone display
  const utcDate = '2024-12-25T06:30:00.000Z';
  const formattedDate = formatDateOnlyToSingaporeTime(utcDate);
  console.log(`UTC Date: ${utcDate}`);
  console.log(`Singapore Display: ${formattedDate}`);
  console.log('');
  
  // Test 3: Get current Singapore time
  const currentSingapore = getCurrentSingaporeTimeISO();
  console.log(`Current Singapore Time: ${currentSingapore}`);
  console.log('');
  
  // Test 4: Time remaining calculation
  const futureDate = new Date();
  futureDate.setHours(futureDate.getHours() + 2); // 2 hours from now
  const timeRemaining = formatTimeRemainingInSingaporeTime(futureDate.toISOString());
  console.log(`Future Date: ${futureDate.toISOString()}`);
  console.log(`Time Remaining: ${timeRemaining}`);
  console.log('');
  
  console.log('=== Test Complete ===');
}

// Run the test if this file is executed directly
if (typeof window === 'undefined') {
  // Node.js environment
  testTimezoneConversion();
}

export { testTimezoneConversion }; 