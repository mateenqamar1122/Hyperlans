import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'
import { corsHeaders } from '../_shared/cors.ts'

// This is a workaround for importing JSON directly
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

interface ContentGenerationRequest {
  prompt: string;
  contentType: string;
  tone?: string;
  instructions?: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { prompt, contentType, tone, instructions } = await req.json() as ContentGenerationRequest
    
    // Ensure request has required fields
    if (!prompt || !contentType) {
      return new Response(
        JSON.stringify({ error: 'Prompt and content type are required' }),
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

    // Construct the system prompt based on content type and tone
    let systemPrompt = `Generate ${contentType} content`
    if (tone) {
      systemPrompt += ` in a ${tone} tone`
    }
    systemPrompt += `. Follow these guidelines:
    - Be clear, concise, and engaging
    - Use proper grammar and formatting
    - Avoid placeholder text or lorem ipsum
    - Be professional and avoid controversial content
    - Limit the length to what's appropriate for the content type`

    if (instructions) {
      systemPrompt += `\nAdditional instructions: ${instructions}`
    }

    // Combine system prompt and user prompt
    const combinedPrompt = `${systemPrompt}\n\nUser prompt: ${prompt}`

    console.log('Making request to Gemini API with prompt:', combinedPrompt.substring(0, 50) + '...')

    // Construct the Gemini API request body
    const geminiRequestBody: GoogleAIRequestBody = {
      contents: [
        {
          parts: [{ text: combinedPrompt }],
          role: "user"
        }
      ],
      generationConfig: {
        temperature: 0.7,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 1024
      }
    }

    // Log the request body for debugging
    console.log('Gemini API request body:', JSON.stringify(geminiRequestBody, null, 2))

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
      
      console.error('Gemini API error:', JSON.stringify(errorData, null, 2))
      
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
    console.log('Received response from Gemini API:', JSON.stringify(data, null, 2))
    
    // Extract the generated text from the response
    let generatedContent = ''
    if (data.candidates && data.candidates[0]?.content?.parts) {
      generatedContent = data.candidates[0].content.parts[0]?.text || ''
    }

    if (!generatedContent) {
      console.error('No content was generated from Gemini API response:', JSON.stringify(data, null, 2))
      return new Response(
        JSON.stringify({ error: 'No content was generated', responseData: data }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ 
        content: generatedContent,
        prompt,
        contentType,
        tone: tone || null
      }),
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