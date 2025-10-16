import { NextResponse } from 'next/server';

const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;
const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
const WHATSAPP_API_VERSION = process.env.WHATSAPP_API_VERSION;
const WHATSAPP_API_URL = `https://graph.facebook.com/${WHATSAPP_API_VERSION}/${WHATSAPP_PHONE_NUMBER_ID}/messages`;

export async function POST(request: Request) {

    try {

        const data = await request.json();
        const user_name = data.user_name;
        const user_phone = data.user_phone;

        const fb_response = await fetch(`${WHATSAPP_API_URL}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                messaging_product: 'whatsapp',
                recipient_type: 'individual',
                to: user_phone,
                type: 'template',
                template: {
                    name: 'welcome_urbai',
                    language: {
                        code: 'es_CL'
                    },
                    components: [
                        {
                            type: 'body',
                            parameters: [
                                {
                                    type: 'text',
                                    text: user_name
                                }
                            ]
                        }
                    ]
                }
            })
        });

        console.log('Facebook response:', fb_response);
        
        if (!fb_response.ok) {
            return NextResponse.json({ message: 'Error sending message' }, { status: 500 });
        }

        const fb_response_data = await fb_response.json();
        console.log('Facebook response data:', fb_response_data);

        return NextResponse.json({ data: fb_response_data }, { status: 201 });

    } catch (error: any) {
        console.error("error", error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
