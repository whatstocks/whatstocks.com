import { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";


const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
    if (event.httpMethod=='POST') {
        if (event.headers.origin=="") {  // TODO make this whatstocks.com
            return {
                statusCode: 403,
            }
        }

        if (!event.headers["content-type"] || !event.headers["content-type"].startsWith('application/x-www-form-urlencoded')) {
            return {
                statusCode: 400,
            }
        }

        if (!event.body) {
            return {
                statusCode: 400,
            }
        }

        const data = new URLSearchParams(event.body)

        const response = await fetch(
            `https://${process.env.MAILCHIMP_SERVER_LOC}.api.mailchimp.com/3.0/lists/${process.env.MAILCHIMP_LIST_ID}`, {
                method: "POST",
                headers: {
                    'Authorization': `Basic ${Buffer.from(`netlify:${process.env.MAILCHIMP_API_KEY}`).toString('base64')}`
                },
                body: JSON.stringify({
                    members: [{
                    email_address: data.get('email'),
                    status: "subscribed",
                    merge_fields: {
                        "TYPE": data.get('type'),
                        "FULLNAME": data.get('name'),
                        "PHONE": data.get('phone')
                    }
                }]})
            }) 

        if (!response.ok) {
            return {
                statusCode: response.status,
                body: response.statusText,
            }; 

        }

        const mcResponse = await response.json()

        if (mcResponse.error_count>0) {
            const error = mcResponse.errors[0]

            return {
                statusCode: 200,
                body: JSON.stringify({
                    title: error.error_code,
                    status: 400,
                    detail: error.error,
                    instance: error.email_address
                })
            }
        }
        
        if (mcResponse.total_created > 0) {
            const member = mcResponse.new_members[0]
            return {
                statusCode: 200,
                body: JSON.stringify({ 
                    id: member.id,
                    email_address: member.email_address,
                    unique_email_id: member.unique_email_id,
                    email_type: member.email_type,
                    status: member.status,
                    merge_fields: member.merge_fields
                }),
            }; 
        }

        return {
            statusCode: 500
        }; 
    }

    return {
        statusCode: 400
    }; 
};

export { handler };
