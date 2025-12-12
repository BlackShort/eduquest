let counter = 1;

function generateTestId() {
  const idNumber = String(counter).padStart(3, "0");
  const testId = `TST-${idNumber}`;
  counter++;
  return testId;
}

module.exports = generateTestId;
