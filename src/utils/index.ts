export const  processImages = (input:string)=> {
    const imgRegex = /<img\s+[^>]*src="([^"]+)"[^>]*>/gi;
    const imageSources:string [] = [];


    const result = input.replace(imgRegex, (_, src) => {
        imageSources.push(src);
        return `see attachment ${imageSources.length}`;
    });

    return {
        description: result,
        imageSources: imageSources
    };
}