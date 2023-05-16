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

        console.log(data)

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

        console.log(response)

        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Subscribe: Not Implemented" }),
        }; 
    }

    return {
        statusCode: 400
    }; 
};

export { handler };
