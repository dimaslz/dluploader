describe('home',  function() {

  beforeEach(function() {
    browser.get('http://localhost:9000/#/');
  });

  it('dummy test', function () {

    expect( element( by.id('title') ).getText() ).toEqual('DLuploader File');

  })
})
