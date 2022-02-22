// for words, phrases we have single structure
interface BaseObjectInterface {
    he: string,
    translit: string,
    ru: string,
    tSlug?: string, // This will make search easier (keywords will be small, regardless of vowels in original translit)
};


export default BaseObjectInterface;