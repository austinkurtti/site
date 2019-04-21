import { KurttiSitePage } from './app.po';

describe('kurtti-site App', function () {
    let page: KurttiSitePage;

    beforeEach(() => {
        page = new KurttiSitePage();
    });

    it('should display message saying app works', () => {
        page.navigateTo();
        expect(page.getParagraphText()).toEqual('app works!');
    });
});
