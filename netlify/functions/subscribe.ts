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

        const form = new URLSearchParams(event.body)

        console.log(form)

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
