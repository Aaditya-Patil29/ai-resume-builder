const Resume = require('../models/Resume');

// @desc    Analyze resume with AI
// @route   POST /api/ai/analyze
// @access  Public
exports.analyzeResume = async (req, res) => {
  try {
    const { resumeData, jobDescription } = req.body;

    // Validate input
    if (!resumeData || !resumeData.personalInfo) {
      return res.status(400).json({
        success: false,
        error: 'Resume data is required'
      });
    }

    // Check if API key exists
    if (!process.env.ANTHROPIC_API_KEY) {
      return res.status(500).json({
        success: false,
        error: 'AI service not configured. Please add ANTHROPIC_API_KEY to .env file'
      });
    }

    // Prepare resume text for analysis
    const resumeText = `
Name: ${resumeData.personalInfo.fullName}
Email: ${resumeData.personalInfo.email}
Summary: ${resumeData.summary || 'Not provided'}
Skills: ${resumeData.skills?.join(', ') || 'Not provided'}
Experience: ${resumeData.experience?.map(exp => 
  `${exp.position} at ${exp.company} (${exp.startDate} - ${exp.endDate})`
).join('; ') || 'Not provided'}
Education: ${resumeData.education?.map(edu => 
  `${edu.degree} in ${edu.field} from ${edu.institution}`
).join('; ') || 'Not provided'}
    `.trim();

    // Call Claude API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        messages: [{
          role: 'user',
          content: `You are an expert ATS (Applicant Tracking System) analyzer and resume consultant. Analyze this resume and provide detailed feedback.

Resume:
${resumeText}

Job Description (if provided): ${jobDescription || 'General software engineering position'}

Please analyze and respond with ONLY a valid JSON object (no markdown, no backticks) in this exact format:
{
  "atsScore": <number between 0-100>,
  "suggestions": [<array of exactly 5 specific, actionable improvement suggestions>],
  "missingKeywords": [<array of important keywords missing from the resume>],
  "strengths": [<array of 3 strengths>],
  "weaknesses": [<array of 3 weaknesses>]
}

Scoring criteria:
- Contact info completeness (10 points)
- Skills relevance (20 points)
- Experience descriptions (25 points)
- Education details (15 points)
- Keywords match (20 points)
- Format & clarity (10 points)`
        }]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'AI API request failed');
    }

    const data = await response.json();
    const analysisText = data.content[0].text;
    
    // Clean and parse the response
    let cleanText = analysisText.trim();
    // Remove markdown code blocks if present
    cleanText = cleanText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    
    const analysis = JSON.parse(cleanText);

    // Validate the response structure
    if (typeof analysis.atsScore !== 'number' || !Array.isArray(analysis.suggestions)) {
      throw new Error('Invalid response format from AI');
    }

    // Update resume in database if resumeId provided
    if (req.body.resumeId) {
      await Resume.findByIdAndUpdate(req.body.resumeId, {
        atsScore: analysis.atsScore,
        suggestions: analysis.suggestions,
        missingKeywords: analysis.missingKeywords || [],
        lastAnalyzed: new Date()
      });
    }

    res.status(200).json({
      success: true,
      data: analysis
    });

  } catch (error) {
    console.error('AI Analysis Error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to analyze resume'
    });
  }
};

// @desc    Get AI suggestions for improvement
// @route   POST /api/ai/improve
// @access  Public
exports.improveSuggestion = async (req, res) => {
  try {
    const { text, type } = req.body; // type: 'summary', 'experience', 'skill'

    if (!process.env.ANTHROPIC_API_KEY) {
      return res.status(500).json({
        success: false,
        error: 'AI service not configured'
      });
    }

    const prompts = {
      summary: `Improve this professional summary to be more impactful and ATS-friendly:\n\n${text}\n\nProvide only the improved version, no explanations.`,
      experience: `Rewrite this job experience bullet point to be more achievement-focused with metrics:\n\n${text}\n\nProvide only the improved version.`,
      skill: `Suggest related skills that should be added based on this skill:\n\n${text}\n\nProvide a comma-separated list only.`
    };

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 500,
        messages: [{
          role: 'user',
          content: prompts[type] || prompts.summary
        }]
      })
    });

    const data = await response.json();
    const improvedText = data.content[0].text;

    res.status(200).json({
      success: true,
      data: { improvedText }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};