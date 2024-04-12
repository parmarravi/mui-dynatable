/**
 * Default configuration object for tables. Contains properties to control:
 * - Title
 * - View only mode
 * - No data message
 * - Edit mode
 * - Add button
 * - Pagination
 * - Sorting
 * - Filtering
 * - Search
 * - Row selection
 * - Row click handling
 * - Refresh
 * - Calendar mode
 * - Custom actions
 */
const defaultTableConfig = {
    title: '',
    viewOnly: false,
    noDataMessage: 'No Data Added',
    isActionEdit: false,
    isAddButton: false,
    maxRows: 5,
    minSearchCharacters: 3,
    isTableDense: true,
    isFilterMenu: false,
    enablePagination: false,
    enableExternalPagination: false,
    orderDefault: 'asc',
    orderByDefault: 'title',
    addButtonLabel: 'ADD',
    filterMenus: [],
    defaultFilter: null,
    searchKeys: [],
    showFilterSelectedLabel: true,
    enableSearch: false,
    enableRowClick: false,
    isRefresh: false,
    isCalendar: false,
    enableAllSelection: false,
    customActions: []
};

export default defaultTableConfig;
