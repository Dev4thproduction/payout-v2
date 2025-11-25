const CaseEntry = require('./models/CaseEntry');
const Verification = require('./models/Verification');

app.post('/api/cases', async (req, res) => {
  const { numberOfCases, verificationId } = req.body;

  try {
    const verification = await Verification.findById(verificationId);
    if (!verification) return res.status(404).json({ message: "Verification entry not found" });

    const salary = numberOfCases * verification.price;

    const caseEntry = new CaseEntry({
      numberOfCases,
      verification: verification._id,
      salary
    });

    await caseEntry.save();

    res.status(201).json(caseEntry);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});
