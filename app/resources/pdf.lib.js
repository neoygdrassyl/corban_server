
/* @Function   : table
* 
* @Description: Creates table using a grid style pattern defined in the arguments, it can create more complex types to tables and handle
*               jump pages more efficiently
* @IMPORTANT:   Before using this function, some working variables must be set in the object doc, these are:
*               doc.startPage = doc.bufferedPageRange().count - 1;
                doc.lastPage = doc.bufferedPageRange().count - 1;
* @Parameters : doc        type: PDFDocument()     - The pdfkit component that allows to create and modify the pdf
*               _cells   type: [                   - The array of cells, each having its own configuration and place in the table
*                                   {
*                                       bold : true | false         - Gives the text the bold property
*                                       color : string | false      - Change the color of the font, it accepts conventional color naming rgb(0,0,0), #000, #000000 and html color names (name the color in lowercase only)
*                                       fill : string | false       - Change the color of the background, it accepts conventional color naming rgb(0,0,0), #000, #000000 and html color names (name the color in lowercase only)
*                                       align : string | 'center'   - It will denote the aligment of the text to be printed, default 'center',
*                                                                      Other values: 'center' | 'right' | 'left' | 'justify'
*                                       bold : boolean | false      - If given changes the font used for that cell
*                                       valign : boolean | false    - It will align the text vertically in the center
*                                       hide : boolean | false      - It will not print the border of the table
*                                       ygap : boolean | false      - This will try to adjust the case for compose tables when jumping pages
*                                   }
*                               ]                 
*               _start   type: [x,y]                - A 2 length array of integers, stating the start position of the table
*               _grid    type: [w,h]                - A 2 length array of integers, stating the grid pattern of the table
*               _config  type:                      - An object defining some various configurations for the whole table
*                        {
*                            lineHeight : string | 11             - It will force the heigt of each row, if used -1 as value, the value will adjust on the size of the text
*                            returnStart : boolean | false        - Using startPage and lastPage, it will place the cursor back at the beggining
*                            equalizePages : boolean | false      - Using startPage and lastPage, it will equalize both values at the end of the creation of the table
*                        }
* @return   :  PDFDocument()
* @examples of usage :
*         doc = PDFDocument()
            pdfSupport.table(doc,
                                [
                                    { coord: [32, 0], w: 8, h: 1, text: 'Parámetros', config: { align: 'center', bold: true, } },
                                    { coord: [40, 0], w: 5, h: 1, text: 'Proyecto', config: { align: 'center', bold: true, } },
                                    { coord: [45, 0], w: 5, h: 1, text: 'Norma', config: { align: 'center', bold: true, } },
                                    { coord: [50, 0], w: 6, h: 1, text: 'P;N', config: { align: 'center', bold: true, } },
                                    { coord: [56, 0], w: 6, h: 1, text: 'Evaluación', config: { align: 'center', bold: true, } },
                                ],
                                [doc.x, doc.y], 
                                [62, 1], 
                                {}
                            )
*
*/
function table(doc, _cells, _start, _grid, _config = {}) {
    let __start = _start;
    let startPage;
    let startY;
    let nextPageNivelator = 0;
    if (_config.returnStart) {
        startPage = doc.startPage;
        startY = doc.startY;
    }

    let docWidth = _config.width ? _config.width : doc.page.width - doc.page.margins.left - doc.page.margins.right;
    let lineHeight = _config.lineHeight;
    let rowsHeighhts = Array(_grid[1]).fill(lineHeight || 11);
    if (lineHeight == null || lineHeight == undefined) lineHeight = 11;
    else if (lineHeight == -1) {
        let stringHeight = 0;
        _cells.map(cell => {
            let size = cell.config.size;
            let width = docWidth / _grid[0] * cell.w;
            let align = cell.config.align ? cell.config.align : 'center';
            let textOptions = {
                align: align,
                columns: 1,
                width: width - 4,
            }
            if (cell.config.bold) doc.font('Helvetica-Bold')
            if(size) doc.fontSize(size[1]);
            let newHS = doc.heightOfString(cell.text, textOptions);
            if(size) doc.fontSize(size[0]);
            doc.font('Helvetica')
            if (newHS > stringHeight) stringHeight = newHS;
            if (newHS > rowsHeighhts[cell.coord[1]]) rowsHeighhts[cell.coord[1]] = newHS + 3;
        })
        lineHeight = stringHeight + 3;
    }
    let cellDim = rowsHeighhts.map(lh => [docWidth / _grid[0], lh]);

    let yCoordOffset = 0 // VARIABLE TO ADJUST THE PLACEMENT OF THE CELL AFTER JUMPING PAGES
    let yCoordOffseti = 0// VARIABLE TO ADJUST THE PLACEMENT OF THE CELL AFTER JUMPING PAGES
    let yCoordOffsety = 0// VARIABLE TO ADJUST THE PLACEMENT OF THE CELL AFTER JUMPING PAGES
    let newPage = false;
    let jumpedPage = (doc.bufferedPageRange().count - 1) != doc.lastPage; // VARIABLE TO ADJUST THE PLACEMENT OF THE CELL AFTER JUMPING PAGES
    _cells.map((cell, i) => {
        let _cellDim = cellDim[cell.coord[1]];
        let nivelator = (cell.coord[1] - nextPageNivelator);
        if (newPage && jumpedPage) {
            nivelator++;
        }
        if (nivelator < 0) nivelator = 0;

        // let start = [__start[0] + _cellDim[0] * cell.coord[0], __start[1] + _cellDim[1] * nivelator - ((_cellDim[1] * yCoordOffsety) * yCoordOffset)];
        let heigtPrevRows = 0;
        rowsHeighhts.map((rh, i) => { if (i < cell.coord[1]) heigtPrevRows += rowsHeighhts[i] });
        let start = [__start[0] + _cellDim[0] * cell.coord[0], __start[1] + heigtPrevRows - ((_cellDim[1] * yCoordOffsety) * yCoordOffset)];
        let fill = cell.config.fill ? String(cell.config.fill).toLowerCase() : 'white';
        let color = cell.config.color ? String(cell.config.color).toLowerCase() : 'black';
        let lineColor = cell.config.lineColor ? String(cell.config.lineColor).toLowerCase() : 'black';
        let strokeColor = cell.config.strokeColor ? String(cell.config.strokeColor).toLowerCase() : 'black';
        let lineWidth = cell.config.lineWidth ? cell.config.lineWidth : 0.5;
        let align = cell.config.align ? cell.config.align : 'center';
        let width = _cellDim[0] * cell.w;
        let height = _cellDim[1] * cell.h;
        let hide = cell.config.hide ? cell.config.hide : false;
        let size = cell.config.size;
        let textOptions = {
            align: align,
            columns: 1,
            width: width - 4,
        }

        if (cell.config.bold) doc.font('Helvetica-Bold')
        if(size) doc.fontSize(size[1]);
        let th = doc.heightOfString(cell.text, textOptions);
        if(size) doc.fontSize(size[0]);
        doc.font('Helvetica')

        let afterY = start[1] + height;
        let jumpY = doc.page.height - doc.page.margins.bottom;
        if (jumpY < afterY) {
            jumpedPage = true
            yCoordOffset = 1;
            yCoordOffseti = _cellDim[1] * (nivelator - 1);
            yCoordOffsety = nivelator - 1;
            __start[1] = doc.page.margins.top;
            __start[0] = doc.page.margins.left;
            if (doc.lastPage == doc.startPage) {
                doc.addPage();
                doc.switchToPage(doc.lastPage);
                doc.lastPage++;
            } else doc.switchToPage(doc.lastPage);
            nextPageNivelator++;
            newPage = true;
            nivelator = (cell.coord[1] - nextPageNivelator);
            if (newPage) nivelator++;
            if (nivelator < 0) nivelator = 0;
            start = [__start[0] + _cellDim[0] * cell.coord[0], __start[1] + _cellDim[1] * nivelator - ((_cellDim[1] * yCoordOffsety) * yCoordOffset)];
        }

        // THIS IS THE FIRST SQUARE
        if (!hide) doc.lineJoin('miter')
            .lineWidth(lineWidth)
            .rect(start[0], start[1], width, height)
            .fill(fill, 1)
            .fillColor(lineColor, 1)
            .strokeColor(strokeColor, 1)
            .stroke();

        // THIS IS THE OUTLINE SQUARE
        if (!hide) doc.lineJoin('miter')
            .lineWidth(0.5)
            .rect(start[0], start[1], width, height)
            .fillColor('black', 1)
            .strokeColor(strokeColor, 1)
            .stroke()

        // THIS IS THE TEXT ON THE SQUARE
        if (cell.config.valign == true || cell.config.valign == 'mid') {
            if (cell.config.bold) doc.font('Helvetica-Bold')
            start[1] = start[1] + (height - th) / 2 - 2
            doc.font('Helvetica');
        }
        else if (cell.config.valign == 'bot') {
            if (cell.config.bold) doc.font('Helvetica-Bold')
            start[1] = start[1] + (height - th) - 2
            doc.font('Helvetica');
        }
        if (cell.config.bold) doc.font('Helvetica-Bold')
        if(size) doc.fontSize(size[1]);
        doc.fillColor(color, 1).text(cell.text, start[0] + 2, start[1] + 3, textOptions);
        doc.strokeColor('black', 1)
        doc.fillColor('black', 1)
        if(size) doc.fontSize(size[0]);
        doc.font('Helvetica');
        
    })
    if (_config.returnStart) {
        let _y = doc.y;
        let _endY = doc._endY ? doc._endY : 0;
        if (_y > _endY) doc._endY = _y;
        doc.y = startY;
        doc.x = doc.page.margins.left;
        doc.switchToPage(startPage);
    } else {
        let finalX = doc.page.margins.left;
        let finalY = __start[1] + rowsHeighhts.reduce((prev, next) => prev + next + 3);
        let rowTh = doc.heightOfString(' ');
        let afterY = finalY + rowTh;
        let jumpY = doc.page.height - doc.page.margins.bottom;
        if (jumpY < afterY) {
            finalY = doc.page.margins.top;
            if (doc.lastPage == doc.startPage) {
                doc.addPage();
                doc.switchToPage(doc.lastPage);
                doc.lastPage++;
            } else {
                doc.switchToPage(doc.lastPage);
            }
        }
        doc.text('', finalX, finalY - (yCoordOffseti) * yCoordOffset);
    }
    if (_config.equalizePages) doc.startPage = doc.lastPage;
    return doc
}

/*@Function   : listText
*
* @Description: Creates a box withh text that can be formated in list form
* @Parameters : doc        type: PDFDocument()          - The pdfkit component that allows to create and modify the pdf
*               Y          type: int                    - The Y position in which the box is going to be printed
*               text       type: string                 - The value to be printes in the box
*               _config    type: {
*                            counterh : bool | false     - Use true to hide the counters all toguether
*                            counters : bool | false     - True to use lower case letter as list counters (a. b. c. ...) or simple scores ( - )
*                            width : int | 500           - It will denote the total width of the box, if not given has a default of 500 units 
*                            align : string | 'justify'  - It will denote the aligment of the text to be printed, default 'justify'
*                            x : int | 56                - It will denote the X position of the box, default 56
*                            draw : bool | true          - True to not draw the box line
*                            number : bool | false       - IF use counters, change then to numbers instead
*                            numberi : int | null        - WHEN using number, change the initial number to numberi
*                            numbers : bool | false      - WHEN using number, will separate 2 or more digits numbers with dots 21 -> 2.1
*                        }
* @return   :  PDFDocument()
* @examples of usage :
*         doc = PDFDocument()
*         lorem = `Lorem ipsum dolor sit amet, consectetur adipiscing elit.\nDuis ac faucibus nunc. Quisque ac eros sed nunc aliquam dignissim sed nec metus. Curabitur fringilla dui eget enim pellentesque, eu consequat nulla cursus.\nVivamus sapien ex, ultricies eu mauris vitae, tristique ornare augue. Suspendisse dui dolor, vehicula vitae nisi ut, facilisis ornare arcu. Donec justo ligula, accumsan ut auctor ac, malesuada in ex. Etiam cursus consectetur purus.\nSuspendisse sed massa a ipsum pellentesque fermentum quis sed ex. Vivamus mattis leo sit amet nisl pellentesque, in sagittis nisi vestibulum. In fringilla nisi vitae mauris auctor, nec imperdiet lectus tempus. Curabitur condimentum ipsum nisi, et laoreet ante rhoncus sed.\nMaecenas luctus in ipsum sed consequat.` 
*         pdfSupport.setHeader(doc, doc.y, lorem)
*        
*
*/
function listText(doc, Y, text, _config = {}) {
    var cell_heigh = 0;
    var _Y = Y
    var config = {
        counterh: (_config.counterh ? true : false),
        counters: (_config.counters ? true : false),
        width: (_config.width ? _config.width : doc.page.width - doc.page.margins.left - doc.page.margins.right),
        align: (_config.align ? _config.align : 'justify'),
        X: (_config.X ? _config.X : doc.page.margins.left),
        draw: (_config.draw != null ? _config.draw : true),
        number: (_config.number ? true : false),
        numberi: (_config.numberi ? _config.numberi : null),
        numbers: (_config.numbers ? true : false),
    }
    var i_heigh = doc.heightOfString(text, {
        align: config.align,
        columns: 1,
        width: config.width - 40,
    });
    if (i_heigh > cell_heigh) cell_heigh = i_heigh;
    _Y = checkForPageJump(doc, cell_heigh, _Y);

    let _data = text ? text.split('\n') : [];
    let initial = 'a'
    if (config.number) {
        initial = 1;
        if (!isNaN(config.numberi)) initial = config.numberi;
    }

    let _delta_y = [0];
    let _delta = 0;
    let regex = /[a-zA-Z]+\s##\s[a-zA-Z]+/i;
    for (var i = 0; i < _data.length; i++) {
        let datai = _data[i].replace(regex, '\n');
        var i_heigh = doc.heightOfString(datai + "\n\n", {
            align: config.align,
            columns: 1,
            width: config.width - 40,
        });
        _delta += i_heigh
        _delta_y.push(_delta)
    }
    _Y = checkForPageJump(doc, _delta, _Y);

    for (var i = 0; i < _data.length; i++) {
        if (_data[i]) {
            let datai = _data[i].replace(regex, '\n');
            if (config.counters) {
                let useDots = false;
                let initialDot;
                let littleOffset = 0;
                if (config.numbers) {
                    initialDot = String(initial).split('');
                    initialDot = initialDot.join('.')
                    useDots = true;
                    littleOffset = 5;
                }

                doc.text(config.counterh ? '' : ((useDots ? initialDot : initial) + "."), config.X + 6, _Y + _delta_y[i] + 10);
                if (config.number) initial++;
                else initial = nextLetter(initial);

                doc.text(datai + "\n\n", config.X + 20 + littleOffset, _Y + _delta_y[i] + 10, {
                    align: config.align,
                    columns: 1,
                    width: config.width - 40,
                });
            }
            else {
                doc.text(config.counterh ? '' : " - ", config.X + 6, _Y + _delta_y[i] + 10);
                doc.text(datai, config.X + 20, _Y + _delta_y[i] + 10, {
                    align: config.align,
                    columns: 1,
                    width: config.width - 40,
                });
            }
        }
    }

    if (config.draw) {
        doc.lineJoin('miter')
            .rect(config.X, _Y, config.width, _delta + 10)
            .lineWidth(0.5)
            .stroke()
    }

    doc.text('', config.X, _Y + _delta + 10);
}

/* @Function   : setHeader
* 
* @Description: Sets a header content on each page
* @Parameters : doc        type: PDFDocument()          - The pdfkit component that allows to create and modify the pdf
*               _config    type: {
*                            title : string | ''        - Prints a designate title bellow the main text
*                            id_public : string | ''    - Prints a designate id next to the title
*                            size : int | 12            - Size of the text font
*                            icon : true | false        - Wheter or not to show the icon
*                        }
* @return   :  PDFDocument()
* @examples of usage :
*         doc = PDFDocument()
*         pdfSupport.setHeader(doc, {icon: true})
*         pdfSupport.setHeader(doc, {title: `General Report of ${month}`, icon: true})
*
*/
function setHeader(doc, _config = {}, curaduriaInfo, lang = 'en') {
    const trn = {
        en: {

        },
        es: {

        }
    }

    var config = {
        title: (_config.title ? _config.title : ""),
        id_public: (_config.id_public ? _config.id_public : ""),
        size: (_config.size ? _config.size : 12),
        icon: (_config.icon ? true : false)
    }
    const range = doc.bufferedPageRange();
    doc.switchToPage(0);
    for (var i = range.start; i < range.count; i++) {
        doc.switchToPage(i);
        let originalMargins = doc.page.margins;
        doc.page.margins = {
            top: 0,
            bottom: doc.page.margins.bottom,
            left: doc.page.margins.left,
            right: doc.page.margins.right
        };

        let x = doc.page.margins.left + 2 + 16;
        let _x = doc.page.width - doc.page.margins.right - 48 - 2 - 16;
        let path = __docsdir + curaduriaInfo.indexName + '/logo.img';
        const fs = require('fs');
        const logoExists = fs.existsSync(path);
        let pathDovela = __basedir + '/docs/public/logo_dovela.img';
        doc.fontSize(config.size);
        doc.font('Helvetica-BoldOblique');

        doc.y = 42;

        table(doc, [
            { coord: [10, 0], w: 40, h: 1, text: `${curaduriaInfo.name}`, config: { align: 'center', bold: true, } },
            { coord: [10, 1], w: 40, h: 1, text: `${curaduriaInfo.dir_title} ${curaduriaInfo.director}`, config: { align: 'center', bold: true, } },
            { coord: [10, 2], w: 40, h: 2, text: `${config.title}`, config: { align: 'center', fill: 'RoyalBlue', bold: true, color: 'white', valign: true } },

            { coord: [0, 0], w: 10, h: 4, text: config.id_public, config: { align: 'center', valign: true,  valign: 'bot',  size: [config.size, 6] } },
            { coord: [50, 0], w: 10, h: 4, text: `DOVELA v.${__doveleVersion}`, config: { align: 'center', valign: 'bot',  size: [config.size, 6]} },

        ], [doc.x, doc.y], [60, 4], { lineHeight: 16 })

        if (config.icon && logoExists) doc.image(path, x, 44, { width: 48, height: 48 })
        doc.image(pathDovela, _x, 44, { width: 48, height: 48 })

        //doc.text(`${curaduriaInfo.name}`, x, 42, { align: 'center' });
        //doc.text(`${curaduriaInfo.dir_title} ${curaduriaInfo.director}`, { align: 'center' });
        //if (config.title) doc.text(config.title, { align: 'center', continue: true });
        doc.fontSize(8);
        //if (config.id_public) doc.text(config.id_public, doc.x, doc.y + 10, { align: 'right' });
        doc.page.margins = originalMargins;
    }
    return doc;
}

/* @Function   : setBottom
* 
* @Description: Sets a botton content on each page
* @Parameters : doc         type: PDFDocument()          - The pdfkit component that allows to create and modify the pdf
*               pagination  type: boolean | false        - Where or not to show the page number at the bottom of the page
*               footer      type: boolean | false        - Where or not to the info text at the bottom of the page
* @return   :  PDFDocument()
* @examples of usage :
*         doc = PDFDocument()
*         pdfSupport.setBottom(doc, false, true)
*
*/
function setBottom(doc, pagination, footer, _height, curaduriaInfo, lang = 'en') {
    const range = doc.bufferedPageRange();
    const height = _height ? _height : 56;
    const trn = {
        en: {
            nit: 'NIT',
            address: 'Address',
            contanct_1: 'Contact',
            contanct_2: 'Contact',
            email: 'Email',
            web: 'Web page',
            of: ' of ',
        },
        es: {
            nit: 'NIT',
            address: 'Dirección',
            contanct_1: 'Contacto',
            contanct_2: 'Contacto',
            email: 'Correo electrónico',
            web: 'Página web',
            of: ' de ',
        }
    }

    doc.switchToPage(0);
    for (var i = range.start; i < range.count; i++) {
        doc.switchToPage(i);
        let originalMargins = doc.page.margins;
        doc.page.margins = {
            top: doc.page.margins.top,
            bottom: 0,
            left: doc.page.margins.left,
            right: doc.page.margins.right
        };
        doc.fontSize(8);
        doc.font('Helvetica');
        doc.text("", doc.page.margins.left, doc.page.height - height);
        if (footer) {
            doc.text(`${(curaduriaInfo.dir_title || '').toUpperCase()} ${(curaduriaInfo.director || '').toUpperCase()}     ${trn[lang].nit}: ${curaduriaInfo.nit}`, { align: 'center' });
            doc.text(`${trn[lang].address}: ${curaduriaInfo.address}     ${trn[lang].contanct_1}: ${curaduriaInfo.number1}  ${trn[lang].contanct_2}: ${curaduriaInfo.number2}    `, { align: 'center' });
            doc.text(`${trn[lang].email}: ${curaduriaInfo.email1}   ${trn[lang].web}: ${curaduriaInfo.page}`, { align: 'center' });
        }
        doc.fontSize(10);
        if (pagination) doc.text(i + 1 + trn[lang].of + range.count, { align: 'center' });
        doc.page.margins = originalMargins;
    }
    return doc;
}

function setSign(doc, useDigitalFirm, curaduriaInfo, lang = 'en') {
    let path = __docsdir + curaduriaInfo.indexName + '/sign.img';
    const fs = require('fs');
    const signExists = fs.existsSync(path);
    if (useDigitalFirm && signExists) {
        doc.fontSize(11).text('\n\n');
        doc.image(`${path}`, { width: 220, height: 60 })
    }
    else doc.fontSize(11).text('\n\n\n\n\n');

    doc.font('Helvetica-Bold')
    doc.fontSize(13).text(`${(curaduriaInfo.dir_title).toUpperCase()} ${(curaduriaInfo.director).toUpperCase()}`);
    doc.fontSize(11).text(curaduriaInfo.job);
    doc.font('Helvetica')

    return doc;
}

/* @Function   : setWaterMark
* 
* @Description: Sets a watermark across the current pages
* @Parameters : doc             type: PDFDocument()          - The pdfkit component that allows to create and modify the pdf
*               text            type: string | ''            - Text to be printed on all pages
*               _config         type: {
*                                   stepX :     int | 200               - Space in X coordinates in between each line of text
*                                   stepY :     int | 200               - Space in Y coordinates in between each line of text
*                                   color :     string | 'gainsboro'    - color or the text
*                                   angle :     int | 0                 - angle in wich the text is going to be tilted 
*                                   fontSize :  int | 16                - font size of the text
*                               }
* @return   :  PDFDocument()
* @examples of usage :
*         doc = PDFDocument()
*         pdfSupport.setWaterMark(doc, 'DO NOT PAY HERE', [1,2,3])
*
*/
function setWaterMark(doc, text, config = {}) {
    const range = doc.bufferedPageRange();

    //doc.switchToPage(0);
    doc.fontSize(config.fontSize ? config.fontSize : 16);
    doc.font('Helvetica');
    let stepX = config.stepX ? config.stepX : 200;
    let stepY = config.stepY ? config.stepY : 200;
    doc.fillColor(config.color ? config.color : 'lightgray');
    let angle = config.angle ? config.angle : 0;

    //doc.switchToPage(i);
    let originalMargins = doc.page.margins;
    doc.page.margins = {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    };
    for (let j = 0; j < doc.page.width + stepX; j = j + stepX) {
        for (let k = 0; k < doc.page.height + stepY; k = k + stepY) {
            doc.rotate(angle, { origin: [j, k] });
            doc.x = j;
            doc.y = k;
            doc.text(text, { lineBreak: false });
            doc.rotate(-angle, { origin: [j, k] });
        }
    }

    doc.page.margins = originalMargins;
    doc.fillColor('black');
    //doc.switchToPage(0);
    doc.x = originalMargins.left;
    doc.y = originalMargins.top;

    return doc;
}


function text(doc, text, _config, x, y) {
    var config = _config ? _config : {}
    var text_heigh = doc.heightOfString(text, config);
    let startMarker = doc.y;
    let final_y = text_heigh + startMarker;
    if (final_y > doc.page.height - doc.page.margins.bottom) {
        if (doc.startPage != undefined) {
            var pageIndex = Number(doc.startPage);
            const range = doc.bufferedPageRange().count;
            if (pageIndex + 1 == range) {
                doc.addPage();
                doc.startPage = pageIndex + 1
            } else {
                doc.switchToPage(pageIndex + 1);
                doc.startPage = pageIndex + 1
            }
        } else {
            doc.addPage();
        }
        doc.y = doc.page.margins.top;
    }
    if (x && y) doc.text(text, x, doc.y, config);
    else doc.text(text, config);

}

// Supporting function for infotext
function nextLetter(s) {
    return s.replace(/([a-zA-Z])[^a-zA-Z]*$/, function (a) {
        var c = a.charCodeAt(0);
        switch (c) {
            case 90: return 'A';
            case 122: return 'a';
            default: return String.fromCharCode(++c);
        }
    });
}

// Function to check for a current existing bug in (this version of) PDFKIT and fix it
function checkForPageJump(doc, _height, _Y) {
    if (_Y + _height + 5 > doc.page.height - doc.page.margins.bottom) {
        if (doc.startPage != undefined) {
            var pageIndex = Number(doc.startPage);
            const range = doc.bufferedPageRange().count;
            if (range == pageIndex + 1) {
                doc.addPage();
                doc.startPage = pageIndex + 1
            } else {
                doc.switchToPage(pageIndex + 1);
                doc.startPage = pageIndex + 1
            }
        } else {
            doc.addPage();
        }
        return doc.page.margins.top;
    }
    return doc.y
}

module.exports = {
    table,
    listText,
    setBottom,
    setSign,
    setHeader,
    setWaterMark,
    text
};