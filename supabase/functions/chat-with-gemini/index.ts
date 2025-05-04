
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'
import { corsHeaders } from '../_shared/cors.ts'

interface Message {
  role: string;
  content: string;
}

interface RequestBody {
  messages: Message[];
}

interface GoogleAIRequestBody {
  contents: Array<{
    parts: Array<{
      text: string;
    }>;
    role?: string;
  }>;
  generationConfig?: {
    temperature?: number;
    topP?: number;
    topK?: number;
    maxOutputTokens?: number;
  };
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { messages } = await req.json() as RequestBody
    
    // Ensure the request has required fields
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Messages array is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get the GEMINI_API_KEY from environment variables
    const apiKey = Deno.env.get('GEMINI_API_KEY')
    if (!apiKey) {
      console.error('API key not configured: GEMINI_API_KEY is missing')
      return new Response(
        JSON.stringify({ error: 'API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    // Convert messages to the format expected by Gemini API
    const geminiContents = messages.map(message => ({
      parts: [{ text: message.content }],
      role: message.role === 'assistant' ? 'model' : message.role
    }));

    console.log('Making request to Gemini API with messages count:', messages.length);

    // Construct the Gemini API request body
    const geminiRequestBody: GoogleAIRequestBody = {
      contents: geminiContents,
      generationConfig: {
        temperature: 0.7,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 1024
      }
    }

    // Make the request to Google Gemini API
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(geminiRequestBody)
      }
    )

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text()
      let errorData
      try {
        errorData = JSON.parse(errorText)
      } catch (e) {
        errorData = { rawResponse: errorText }
      }
      
      console.error('Gemini API error:', errorData)
      
      return new Response(
        JSON.stringify({ 
          error: 'Failed to generate content', 
          details: errorData,
          status: geminiResponse.status 
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const data = await geminiResponse.json()
    console.log('Received response from Gemini API')
    
    // Extract the generated text from the response
    let response = ''
    if (data.candidates && data.candidates[0]?.content?.parts) {
      response = data.candidates[0].content.parts[0]?.text || ''
    }

    if (!response) {
      console.error('No content was generated from Gemini API response:', data)
      return new Response(
        JSON.stringify({ error: 'No content was generated', responseData: data }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ response }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error processing request:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
