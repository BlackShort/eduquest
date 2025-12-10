const mongoose = require('mongoose');
async function getTestcasesForQuestion(questionId, mode) {

    const sampleTestcases = [
        {
            _id: new mongoose.Types.ObjectId(),
            input: '2 3\n',
            expectedOutput: '5\n',
            isSample: true,
        },
        {
            _id: new mongoose.Types.ObjectId(),
            input: '10 20\n',
            expectedOutput: '30\n',
            isSample: true,
        },
    ];

    const hiddenTestcases = [
        {
            _id: new mongoose.Types.ObjectId(),
            input: '100 200\n',
            expectedOutput: '300\n',
            isSample: false,
        },
    ];

    if (mode === 'run') {
        
        return sampleTestcases;
    }

    return [...sampleTestcases, ...hiddenTestcases];
}

module.exports = {
    getTestcasesForQuestion,
};
