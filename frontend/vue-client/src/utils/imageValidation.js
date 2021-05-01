const isImageExtensionValid = (imageFile, extensions) => {
    let isValid = false
    if (imageFile && extensions.length > 0) {
        let fileName = imageFile.name;
        let fileNameArr = fileName.split('.');
        let fileExt = fileNameArr[fileNameArr.length - 1].toLowerCase();
        if(extensions.includes(fileExt)) {
            isValid = true
        }
    }
    return isValid
}

const isImageSizeValid = (imageFile, byteSize) => {
    let isValid = false
    if (imageFile && byteSize > 0) {
        let fileSize = imageFile.size;
        if(fileSize <= byteSize) {
            isValid = true
        }
    }
    return isValid
}

const imageUploadValidation = {
    
    checkExtension: isImageExtensionValid,
    checkSize: isImageSizeValid
}

export default imageUploadValidation;