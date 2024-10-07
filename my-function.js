export const handler = async (event) => {
    const keyword = event.queryStringParameters.keyword || '';
    const response = `Ruthvik Madavaram says ${keyword}`;

    return {
        statusCode: 200,
        body: JSON.stringify({
            message: response,
        }),
    };
};