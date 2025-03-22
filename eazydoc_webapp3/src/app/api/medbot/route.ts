import { NextResponse } from "next/server";
import { getMedbotModel } from "@/lib/gemini";

export async function POST(req: Request) {
  try {
    const { message, conversationContext } = await req.json();
    const model = getMedbotModel();

    const prompt = `You are MedBot, an interactive medical assistant chatbot. Your goal is to understand user symptoms through a structured conversation.

USER CONTEXT:
Previous Context: ${conversationContext || "Initial conversation"}
Current Message: ${message}

CONVERSATION GUIDELINES:
1. If this is the first message, introduce yourself and ask about their main health concern
2. For follow-up messages:
   - Acknowledge their response
   - Ask relevant follow-up questions based on their symptoms
   - Only proceed to recommendations after gathering sufficient information

RESPONSE FORMAT:
## Response
{Your direct response to the user}

## Follow-up Question
{Your next question to gather more information}

## Analysis
- Symptom Analysis: {Brief analysis of symptoms reported so far}
- Specialist Type: {Recommended specialist if enough information gathered}
- Urgency Level: {Any urgent warnings or immediate actions needed}

## Context
{Summary of conversation context for next interaction}

Remember to:
- Ask only one question at a time
- Show empathy while maintaining professionalism
- Flag any potentially serious symptoms
- Keep responses conversational but focused`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // Parse the structured response
    const structuredResponse = parseInteractiveResponse(text);

    return NextResponse.json({ response: structuredResponse });
  } catch (error) {
    console.error("MedBot error:", error);
    return NextResponse.json(
      { error: "Failed to process your request" },
      { status: 500 }
    );
  }
}

function parseInteractiveResponse(response: string) {
  const sections = response.split('##').filter(section => section.trim());
  
  const parseSection = (title: string) => {
    const section = sections.find(s => s.trim().startsWith(title));
    return section
      ?.replace(title, '')
      ?.trim() || '';
  };

  // Parse the Analysis section into subsections
  const analysisSection = parseSection('Analysis');
  const analysisLines = analysisSection.split('\n');
  const analysis = {
    symptomAnalysis: analysisLines.find(line => line.includes('Symptom Analysis:'))?.split(':')[1]?.trim() || '',
    specialistType: analysisLines.find(line => line.includes('Specialist Type:'))?.split(':')[1]?.trim() || '',
    urgencyLevel: analysisLines.find(line => line.includes('Urgency Level:'))?.split(':')[1]?.trim() || ''
  };

  return {
    response: parseSection('Response'),
    followUpQuestion: parseSection('Follow-up Question'),
    analysis: analysis,
    context: parseSection('Context')
  };
}