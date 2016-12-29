export class FilterValueConverter {
    toView(array, searchTerm, filterFunc) {
        if (array === undefined) {
            return [];
        }
        if (searchTerm === undefined) {
            return array;
        }

        searchTerm = searchTerm.trim();

        return array.filter((item) => {
            let matches = searchTerm && searchTerm.length > 0 ? filterFunc(searchTerm, item) : true;
            return matches;
        });
    }
}