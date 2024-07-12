const { request, response } = require('express');
const jwt = require('jsonwebtoken');
const {config} = require('../config/config')
const conversacion = require('../models/conversacion.model');
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require("@google/generative-ai");

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

class ConversacionController{

    async crear(req=request, res=response){

        // For text-only input, use the gemini-pro model
        const model = genAI.getGenerativeModel({ model: "gemini-pro"});

        const generationConfig = {
            temperature: 0.9,
            topK: 1,
            topP: 1,
            maxOutputTokens: 200,
        };

        const safetySettings = [
            {
              category: HarmCategory.HARM_CATEGORY_HARASSMENT,
              threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            },
            {
              category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
              threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            },
            {
              category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
              threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            },
            {
              category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
              threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            },
        ];

        const history = [
            {
                role: "user",
                parts: [{ text: "System prompt: Your name is not Gemini, your name is Tuto. You are a very successful and experienced English tutor. You only can speak in English, even if users ask to speak in other language. No matter what ask you the user, each time that you response, the first part of the message must be the correction or traduction of the user message, adding the expression 'Better expression: ' at front, then put a point sign, and the second part must be your answer to procede with the conversation, including questions or curious information about the conversation topic. If user send the message 'Choose a topic!', you must choose one interesting topic, omitting the part of 'Better expression: ' in your answer just for that time and answering with a short message. To make this more fun and entertaining create a Persona for Teacher Tuto that matches a kind professor who enjoy helping people to learn English . Respond understood if you got it."}],
            },
            {
                role: "model",
                parts: [{ text: "Understood."}],
            }
        ];

        const chat = model.startChat({
            generationConfig,
            safetySettings,
            history: history
          });

        const prompt = req.body.mensajes[0]?.parts[0]?.text;

        const result = await chat.sendMessage(prompt);
        const response = result.response;
        const text = {parts: [{text: response.text()}], role: "model"};
        req.body.mensajes.push(text);

        try {
            const conver = new conversacion({...history, ...req.body});
            const conversacionCreada = await conver.save()
            if(conversacionCreada){
                return res.status(200).json({message: 'Conversación iniciada', status: 200, data: conversacionCreada });
            }else{
                return res.status(400).json({message: 'Problemas para iniciar la conversación', status: 400});
            }
        } catch (error) {
            return res.status(500).json({message: 'Problemas con el servidor', status: 500});
        }
    }

    async continuar(req = request, res = response){
        const model = genAI.getGenerativeModel({ model: "gemini-pro"});

        let conver = await conversacion.findById(req.body._id);

        const generationConfig = {
            temperature: 0.9,
            topK: 1,
            topP: 1,
            maxOutputTokens: 600,
        };

        const safetySettings = [
            {
              category: HarmCategory.HARM_CATEGORY_HARASSMENT,
              threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            },
            {
              category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
              threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            },
            {
              category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
              threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            },
            {
              category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
              threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            },
        ];

        const history = [
            {
                role: "user",
                parts: [{ text: "System prompt: Your name is not Gemini, your name is Tuto. You are a very successful and experienced English tutor. You only can speak in English, even if users ask to speak in other language. No matter what ask you the user, each time that you response, the first part of the message must be the correction or traduction of the user message, adding the expression 'Better expression: ' at front, then put a point sign, and the second part must be your answer to procede with the conversation, including questions or curious information about the conversation topic. If user send the message 'Choose a topic!', you must choose one interesting topic, omitting the part of 'Better expression: ' in your answer just for that time and answering with a short message. To make this more fun and entertaining create a Persona for Teacher Tuto that matches a kind professor who enjoy helping people to learn English . Respond understood if you got it."}],
            },
            {
                role: "model",
                parts: [{ text: "Understood."}],
            }
        ];

        if(conver){
            try {
                const chat = model.startChat({
                    generationConfig,
                    safetySettings,
                    history: [...history, ...req.body.mensajes.slice(0, req.body.mensajes.length-1)]
                })

                const result = await chat.sendMessage(req.body.mensajes[req.body.mensajes?.length -1]?.parts[0]?.text);
                const response = result.response;
                const text = {parts: [{text: response.text()}], role: "model"};

                req.body.mensajes.push(text);

                let conversacionActualizada = await conversacion.findByIdAndUpdate(req.body._id, req.body).then(async rta => {
                    let last = await conversacion.findById(rta._id);
                    return last
                });

                if(conversacionActualizada){
                    return res.status(200).json({message: 'Conversación actualizada', status: 200, data: conversacionActualizada });
                }else{
                    return res.status(500).json({message: 'Problemas para actualizar la conversación', status: 500});
                }
            } catch (error) {
                console.log(error)
                return res.status(500).json({message: 'Problemas con el servidor', status: 500});
            }
        }else{
            return res.status(400).json({message: 'Problemas para encontrar la conversación', status: 400});
        }

        

    }

    async getOne(req = request, res = response){
        try {
            let chats = await conversacion.find({$and: [{"mensajes.parts.text": { "$regex": req.params.buscar, "$options": "i" }}, {userId: req.body.userId}]})

            if(chats){
                return res.status(200).json({message: 'Ok', status: 200, data: chats });
            }else{
                return res.status(400).json({message: 'No se encontraron chats', status: 400});
            }
        } catch (error) {
            return res.status(500).json({message: 'Problemas en el servidor', status: 500});
        }
    }

    async getAll(req = request, res = response){
        try {
            let chats = await conversacion.find({userId: req.body.userId})
            if(chats){
                return res.status(200).json({message: 'Ok', status: 200, data: chats });
            }else{
                return res.status(400).json({message: 'No se encontraron chats', status: 400});
            }
        } catch (error) {
            return res.status(500).json({message: 'Problemas en el servidor', status: 500});
        }
    }

}

module.exports = ConversacionController;