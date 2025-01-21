export interface CreateHTMLOptions {
  body: string
  preStyles?: string
  bodyStyles?: string
  backgroundColor?: string
  textColor?: string
}

export function createHTML(options: CreateHTMLOptions) {
  const {
    body,
    preStyles = '',
    bodyStyles = '',
    backgroundColor = '#ffffffff',
    textColor = '#000000',
  } = options

  return `
        <!DOCTYPE html>
        <html>
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
                <style>
                    ${preStyles}
                    * { box-sizing: border-box; }
                    html, body { margin: 0; padding: 0;font-family: Arial, Helvetica, sans-serif;}
                    body { overflow-y: hidden; background-color: ${backgroundColor}; ${bodyStyles}}
                    #content { color: ${textColor}; font-size: 14px; }
                </style>
            </head>
            <body>
                <div id="content">
                    ${body}
                </div>
            </body>
        </html>
    `
}
