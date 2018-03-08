  //
    // NOTE: 
    // Modifying the URL below to another server will likely *NOT* work. Because of browser
    // security restrictions, we have to use a file server with special headers
    // (CORS) - most servers don't support cross-origin browser requests.
    //
    
    


    //
    // Disable workers to avoid yet another cross-origin issue (workers need the URL of
    // the script to be loaded, and currently do not allow cross-origin scripts)
    //
    PDFJS.disableWorker = false;

    var pdfDoc = null,
        pageNum = 1,
        scale = 1,
        canvasContainer = document.getElementById('the-canvas');
        //ctx = canvas.getContext('2d');

    //
    // Get page info from document, resize canvas accordingly, and render page
    //
	var pages = [];
	var currentPage =1; 
    function renderPage(num) {
      // Using promise to fetch the page
      pdfDoc.getPage(num).then(function(page) {
        var height = 700;
        var viewport = page.getViewport(1);
        var scale = height / viewport.height;
        var scaledViewport = page.getViewport(scale);

        var canvas = document.createElement('canvas');
		 var context = canvas.getContext('2d');
		canvas.height = scaledViewport.height;
        canvas.width = scaledViewport.width;

        // Render PDF page into canvas context
        var renderContext = {
          canvasContext: context,
          viewport: scaledViewport
        };
        page.render(renderContext).then(function(){
			if(currentPage < pdfDoc.numPages) {
                pages[currentPage] = canvas;
                currentPage++;
                renderPage(currentPage);
            }else{
				for (var i = 1; i < pages.length; i++) {
					document.getElementById('the-canvas').appendChild(pages[i]);
                }
			}
			
		});
      });

      // Update page counters
      document.getElementById('page_num').textContent = pageNum;
      document.getElementById('page_count').textContent = pdfDoc.numPages;
    }

    //
    // Go to previous page
    //
    function goPrevious() {
      if (pageNum <= 1)
        return;
      pageNum--;
      renderPage(pageNum);
    }

    //
    // Go to next page
    //
    function goNext() {
      if (pageNum >= pdfDoc.numPages)
        return;
      pageNum++;
      renderPage(pageNum);
    }

    //
    // Asynchronously download PDF as an ArrayBuffer
    //
    PDFJS.getDocument(url).then(function getPdfHelloWorld(_pdfDoc) {
      pdfDoc = _pdfDoc;
      renderPage(pageNum);
    });