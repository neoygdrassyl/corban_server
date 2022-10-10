
const donwloadDocument = (req, res) => {
    const fileName = req.params.filename;
    const dbIndex = req.params.dbIndex;
    const homePath = req.params.homePath;
    const year = req.params.year;
    const folder = req.params.folder;

    const directoryPath = __docsdir;

    res.download(directoryPath + "/" + dbIndex + "/" + homePath + "/" + year + "/" + folder + "/" + fileName, fileName, (err) => {
        if (err) {
            res.status(500).send({
                message: "ERROR_DOC",
            });
        } else {
            console.log('DOWNLOAD DOCUMENT, GIVEN: ', fileName)
        }
    });

};

function download(res, path, file) {
    const directoryPath = __basedir;
    const docPath = directoryPath + path;
    res.download(docPath, file, (err) => {
        if (err) {
            res.status(500).send({
                message: "Could not download the file: " + file,
            });
        } else {
            console.log('Donwload for document: ', file)
        }
    });
}

function downloadExt(res, path, file) {
    const directoryPath = __docsdir;
    const docPath = directoryPath + path;
    res.download(docPath, file, (err) => {
        if (err) {
            res.status(500).send({
                message: "Could not download the file: " + file,
            });
        } else {
            console.log('Donwload for document: ', file)
        }
    });
}

module.exports = {
    donwloadDocument,
    download,
    downloadExt
};
