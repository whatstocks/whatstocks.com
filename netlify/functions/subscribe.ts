import { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";

const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
    return {
        statusCode: 500,
        body: JSON.stringify({ message: "Subscribe: Not Implemented" }),
    }; 
};

export { handler };
