import * as React from 'react';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import { visuallyHidden } from '@mui/utils';
import { useTheme } from '@mui/system';
/**
 * Imports Material UI React components to be used in this component.
 */
import {
    Box,
    Button,
    Paper,
    Typography,
    Checkbox,
    IconButton,
    Toolbar,
    Tooltip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TableSortLabel,
    Card,
    CardContent,
    useMediaQuery,
    Grid,
    TextField,
    InputAdornment,
    Menu,
    MenuItem,
    Chip
} from '@mui/material';

// Icons and Images
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import NoDataImage from '../../assets/images/nodata.svg';

// Components
import TableLoading from '../Loading/TableLoading';
import ServerError from '../Cards/ErrorCard';
import CalendarSelector from '../Calendar/CalendarSelector';
import DeleteDialogConfirmation from '../Dialogs/DeleteDialogConfirmation';

// Config
import defaultTableConfig from '../../utils/config';

function descendingComparator(a, b, orderBy) {
    if (orderBy === null || orderBy === undefined) {
        return 0;
    }
    if (a === null || a === undefined || b === null || b === undefined) {
        return 0;
    }
    if (!(orderBy in a) || !(orderBy in b)) {
        return 0;
    }
    if (a[orderBy] === null || a[orderBy] === undefined) {
        return 1;
    }
    if (b[orderBy] === null || b[orderBy] === undefined) {
        return -1;
    }
    const typeA = typeof a[orderBy];
    const typeB = typeof b[orderBy];

    if (typeA !== typeB) {
        if (typeA === 'object' || typeB === 'object') {
            return 0;
        } else if (typeA === 'array' || typeB === 'array') {
            return 0;
        } else {
            return 0;
        }
    }

    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

function EnhancedTableHead(props) {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort, headCells, isActions, isViewOnly } = props;
    const theme = useTheme();

    const createSortHandler = (property) => {
        onRequestSort(property);
    };

    return (
        <TableHead style={{ backgroundColor: theme.palette.secondary.light }}>
            <TableRow>
                <TableCell padding={'checkbox'}>
                    {!isViewOnly && (
                        <Checkbox
                            color="primary"
                            indeterminate={numSelected > 0 && numSelected < rowCount}
                            checked={rowCount > 0 && numSelected === rowCount}
                            onChange={onSelectAllClick}
                            inputProps={{
                                'aria-label': 'select all data'
                            }}
                        />
                    )}
                </TableCell>

                {headCells.map((headCell, index) => {
                    const tableHeadCellConfig = headCell.headCellStyle;
                    return (
                        <TableCell
                            key={headCell.id}
                            align={index === 0 ? 'left' : 'left'}
                            padding={index === 0 ? 'none' : 'normal'}
                            sx={{ ...tableHeadCellConfig, whiteSpace: 'nowrap' }}
                            sortDirection={orderBy === headCell.id ? order : false}
                        >
                            <TableSortLabel
                                active={orderBy === headCell.id}
                                direction={orderBy === headCell.id ? order : 'asc'}
                                onClick={() => {
                                    createSortHandler(headCell.id);
                                }}
                                sx={{
                                    fontWeight: 700,
                                    color: theme.palette.secondary.dark,
                                    whiteSpace: 'unset'
                                }}
                            >
                                {headCell.label}
                                {orderBy === headCell.id ? (
                                    <Box component="span" sx={visuallyHidden}>
                                        {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                    </Box>
                                ) : (
                                    <></>
                                )}
                            </TableSortLabel>
                        </TableCell>
                    );
                })}
                {isActions && (
                    <TableCell align={'left'} padding={'normal'} sx={{ fontWeight: 700, color: theme.palette.secondary.dark }}>
                        Actions
                    </TableCell>
                )}
            </TableRow>
        </TableHead>
    );
}

function EnhancedTableToolbar(props) {
    const {
        numSelected,
        title,
        isFilter,
        filterMenus,
        onFilterOptionCallback,
        isAddButton,
        addButtonLabel = 'Add',
        onAddCallback,
        onDeleteCallback,
        enableSearch,
        handleSearchChange,
        isRefreshButton,
        onRefreshCallback,
        filterSelected,
        setSelectedFilter,
        setSearchTerm,
        searchTerm,
        showFilterSelectedLabel,
        isCalendar,
        dateHandler,
        minSearchCharacters,
        customActions,
        onActionCallback
    } = props;

    const [anchorEl, setAnchorEl] = React.useState(null);
    const [searchError, setSearchError] = React.useState(false);

    const handleSearchChangeInternal = (e) => {
        setSearchTerm(e.target.value);
        handleSearchChange(e.target.value);
    };

    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    useEffect(() => {
        if (searchTerm.length === 0) {
            setSearchError(false);
        } else if (searchTerm.length <= minSearchCharacters) {
            setSearchError(true);
        } else {
            setSearchError(false);
        }
    }, [searchTerm]);

    const enableFilterSection = isRefreshButton || isCalendar || isFilter || isAddButton;
    const enableSearchSection = enableSearch;
    const enableTitle = title.length > 1;
    return (
        <Toolbar
            sx={{
                pl: { sm: 2 },
                pr: { xs: 1, sm: 1 },
                ...(numSelected > 0 && {
                    bgcolor: (theme) => alpha(theme.palette.secondary.main, theme.palette.action.activatedOpacity)
                })
            }}
        >
            {numSelected > 0 ? (
                <Typography sx={{ flex: '1 1 100%' }} color="inherit" variant="subtitle1" component="div">
                    {numSelected} selected
                </Typography>
            ) : (
                <Grid container rowSpacing={1}>
                    <Grid display={enableTitle ? 'flex' : 'none'} item xs={enableTitle ? 6 : 0} lg={enableTitle ? 6 : 0}>
                        <Typography variant="h4" id="tableTitle" component="div">
                            {title}
                        </Typography>
                    </Grid>

                    <Grid
                        item
                        display={enableSearchSection ? 'flex' : 'none'}
                        xs={enableSearchSection ? 12 : 0}
                        md={enableSearchSection ? 8 : 0}
                        lg={enableSearchSection ? 6 : 0}
                    >
                        <TextField
                            error={searchError}
                            label={searchError ? 'Error' : 'Search'}
                            value={searchTerm}
                            placeholder="Search..."
                            onChange={handleSearchChangeInternal}
                            variant="outlined"
                            sx={{ width: '100%' }}
                            helperText={searchError ? `Enter Minimum ${minSearchCharacters} Characters` : ''}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <IconButton disabled>
                                            <SearchIcon color="secondary" />
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />
                    </Grid>

                    <Grid
                        item
                        display={enableFilterSection ? 'flex' : 'none'}
                        justifyContent={'end'}
                        alignItems={'center'}
                        xs={enableSearchSection ? 12 : enableTitle ? 6 : 12}
                        md={enableSearchSection ? (enableTitle ? 12 : 8) : enableTitle ? 6 : 8}
                        sm={enableSearchSection ? (enableTitle ? 12 : 12) : enableTitle ? 6 : 12}
                        lg={enableSearchSection ? (enableTitle ? 12 : 6) : enableTitle ? 6 : 12}
                    >
                        {isRefreshButton ? (
                            <IconButton onClick={onRefreshCallback}>
                                <RefreshIcon color="secondary" />
                            </IconButton>
                        ) : (
                            <></>
                        )}

                        {isCalendar && <CalendarSelector onSelect={dateHandler} />}

                        {isFilter ? (
                            <>
                                <Tooltip title="Filter list">
                                    <IconButton onClick={handleClick}>
                                        {showFilterSelectedLabel ? (
                                            <Chip
                                                avatar={<FilterListIcon />}
                                                label={filterSelected === null ? '' : filterSelected?.label}
                                            />
                                        ) : (
                                            <FilterListIcon />
                                        )}
                                    </IconButton>
                                </Tooltip>

                                <Menu
                                    id="filter-menu"
                                    aria-labelledby="filter-button"
                                    anchorEl={anchorEl}
                                    open={open}
                                    onClose={handleClose}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right'
                                    }}
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right'
                                    }}
                                >
                                    {filterMenus.map((data) => {
                                        return (
                                            <MenuItem
                                                key={data.id}
                                                sx={{
                                                    backgroundColor:
                                                        filterSelected?.id === data.id
                                                            ? (theme) =>
                                                                  alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity)
                                                            : 'transparent'
                                                }}
                                                onClick={() => {
                                                    handleClose();
                                                    setSelectedFilter(data);
                                                    onFilterOptionCallback(data);
                                                }}
                                            >
                                                {data.label}
                                            </MenuItem>
                                        );
                                    })}
                                </Menu>
                            </>
                        ) : (
                            <></>
                        )}

                        {isAddButton ? (
                            <div
                                style={{
                                    alignItems: 'flex-end',
                                    justifyContent: 'flex-end',
                                    display: 'flex'
                                }}
                            >
                                <Tooltip title={addButtonLabel}>
                                    <Button variant="contained" sx={{ minWidth: 'fit-content' }} onClick={onAddCallback}>
                                        {addButtonLabel}
                                    </Button>
                                </Tooltip>
                            </div>
                        ) : (
                            <></>
                        )}
                    </Grid>
                </Grid>
            )}

            {numSelected > 0 ? (
                customActions.length > 0 ? (
                    <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                        {customActions.map((data) => {
                            return data?.icon === null || data?.icon === undefined ? (
                                <Button
                                    key={data?.id}
                                    variant="contained"
                                    style={{ ...data.style }}
                                    onClick={() => {
                                        onActionCallback(data.id);
                                    }}
                                >
                                    {data?.label}
                                </Button>
                            ) : (
                                <Tooltip key={data?.id} title={data?.label}>
                                    <IconButton style={{ ...data.style }} onClick={onDeleteCallback}>
                                        {data?.icon}
                                    </IconButton>
                                </Tooltip>
                            );
                        })}
                    </Box>
                ) : (
                    <Tooltip title="Delete">
                        <IconButton onClick={onDeleteCallback}>
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                )
            ) : (
                <>
                    {/* {isAddButton ? (
                        <div
                            style={{
                                alignItems: 'flex-end',
                                justifyContent: 'flex-end',
                                display: 'flex'
                            }}
                        >
                            <Tooltip title={addButtonLabel}>
                                <Button variant="contained" sx={{ minWidth: 'fit-content' }} onClick={onAddCallback}>
                                    {addButtonLabel}
                                </Button>
                            </Tooltip>
                        </div>
                    ) : (
                        <></>
                    )} */}
                </>
            )}
        </Toolbar>
    );
}

EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
    title: PropTypes.string,
    isFilter: PropTypes.bool,
    isAddButton: PropTypes.bool,
    addButtonLabel: PropTypes.string,
    onAddClickCallback: PropTypes.func,
    enableSearch: PropTypes.bool,
    handleSearchChange: PropTypes.func,
    onRefreshCallback: PropTypes.func,
    onFilterOptionCallback: PropTypes.func,
    filterMenus: PropTypes.array,
    filterSelected: PropTypes.any,
    setSelectedFilter: PropTypes.any,
    searchTerm: PropTypes.string,
    setSearchTerm: PropTypes.any,
    showFilterSelectedLabel: PropTypes.bool,
    isCalendar: PropTypes.bool,
    dateHandler: PropTypes.func,
    minSearchCharacters: PropTypes.number,
    onActionCallback: PropTypes.func,
    customActions: PropTypes.array
};

const MuiDynaTable = (props) => {
    const {
        data,
        headCells,
        tableConfig,
        customToolbar,
        isLoading = false,
        isError = false,
        onRetryCallback,
        onAddClickCallback,
        onEditClickCallback,
        onDeleteClickCallback,
        handleSearchChange,
        handleRowClick,
        handleSingleRowClick,
        onRefreshCallback,
        onFilterOptionCallback,
        dateHandlerCallback,
        externalPaginationRender,
        onActionCallback,
        isCustomDeleteDialog = true
    } = props;

    const [tableUiConfig, setTableUiConfig] = React.useState(defaultTableConfig);
    const [order, setOrder] = React.useState(defaultTableConfig.orderDefault);
    const [orderBy, setOrderBy] = React.useState(defaultTableConfig.orderByDefault);
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(defaultTableConfig.maxRows);
    const isMobileUi = useMediaQuery('(max-width:600px)');
    const isTablet = useMediaQuery('(min-width:600px) and (max-width: 991px)');
    const [isDeleteDialogShow, setDeleteDialogShow] = useState(false);
    const [keyList, setKeyList] = useState([]);
    const [filterSelected, setSelectedFilter] = React.useState(tableConfig?.defaultFilter);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const configUpdate = { ...defaultTableConfig, ...tableConfig };
        setTableUiConfig(configUpdate);
        setSelectedFilter(configUpdate?.defaultFilter);
        setKeyList(headCells.map((headCell) => headCell.id));
    }, []);

    useEffect(() => {
        setTableUiConfig((val) => ({ ...val, ...tableConfig }));
    }, [tableConfig]);

    useEffect(() => {
        setKeyList(headCells.map((headCell) => headCell.id));
    }, [headCells]);

    useEffect(() => {
        setSelected([]);
    }, [data]);

    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelected = data.map((n) => n.id);
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };

    const handleClick = (id) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
        }

        setSelected(newSelected);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const isSelected = (id) => selected.indexOf(id) !== -1;

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

    const extractValue = (row, dataKeys) => {
        var result = {};
        dataKeys.forEach((key) => {
            const keys = key.split('.');
            let value = row;
            keys.forEach((key) => {
                value = value ? value[key] : undefined;
            });
            if (dataKeys.length > 1) {
                result[key] = value;
            } else {
                result = value;
            }
        });
        return result;
    };

    const TableBodyContent = (row, isItemSelected, labelId) => {
        return (
            <TableRow
                hover
                role="checkbox"
                aria-checked={isItemSelected}
                tabIndex={-1}
                key={row.id}
                onClick={() => {
                    if (handleRowClick) handleRowClick(row);
                }}
            >
                <TableCell padding="checkbox">
                    {!tableUiConfig.viewOnly && (
                        <Checkbox
                            color="primary"
                            onChange={() => handleClick(row.id)}
                            checked={isItemSelected}
                            inputProps={{
                                'aria-labelledby': labelId
                            }}
                        />
                    )}
                </TableCell>

                {keyList.map((key, index) => {
                    const tableCellConfig = headCells.filter((data) => data.id === key);

                    if (tableCellConfig[0] === null || tableCellConfig[0] === undefined) {
                        return <></>;
                    }
                    // const value = tableCellConfig[0].data_key ? row[tableCellConfig[0].data_key] : row[key];
                    const value = tableCellConfig[0].data_key ? extractValue(row, tableCellConfig[0].data_key) : row[key];

                    return (
                        <TableCell
                            id={index === 0 ? labelId : key}
                            padding={index === 0 ? 'none' : 'normal'}
                            align={index === 0 ? 'left' : value === null || value === undefined ? 'center' : 'left'}
                            key={key}
                            onClick={() => {
                                if (handleSingleRowClick) handleSingleRowClick(key, row);
                            }}
                            sx={{
                                ...tableCellConfig[0].tableCellStyle,
                                overflowWrap: 'break-word',
                                wordBreak: 'break-word',
                                cursor: handleSingleRowClick !== null || handleSingleRowClick !== undefined ? 'pointer' : 'auto'
                            }}
                        >
                            {tableCellConfig[0]?.export_render
                                ? tableCellConfig[0]?.export_render(value)
                                : value === null || value === undefined
                                ? '-'
                                : value}
                        </TableCell>
                    );
                })}

                {tableUiConfig.isActionEdit && (
                    <TableCell padding="checkbox" align="center">
                        <Tooltip title="Edit">
                            <IconButton
                                onClick={() => {
                                    onEditClickCallback(row.id);
                                }}
                            >
                                <EditIcon />
                            </IconButton>
                        </Tooltip>
                    </TableCell>
                )}
            </TableRow>
        );
    };

    return (
        <Box
            sx={{
                width: isMobileUi ? '100%' : isTablet ? '100%' : '90%',
                border: 0.5,
                borderColor: 'lightgrey'
            }}
        >
            <Paper sx={{ width: '100%' }}>
                <>
                    {customToolbar ? (
                        customToolbar
                    ) : (
                        <EnhancedTableToolbar
                            numSelected={selected.length}
                            title={tableUiConfig.title}
                            isFilter={tableUiConfig.isFilterMenu}
                            isAddButton={tableUiConfig.isAddButton}
                            addButtonLabel={tableUiConfig.addButtonLabel}
                            onAddCallback={onAddClickCallback}
                            filterMenus={tableUiConfig.filterMenus}
                            handleSearchChange={handleSearchChange}
                            enableSearch={tableUiConfig.enableSearch}
                            isRefreshButton={tableUiConfig.isRefresh}
                            onRefreshCallback={onRefreshCallback}
                            onFilterOptionCallback={onFilterOptionCallback}
                            filterSelected={filterSelected}
                            setSelectedFilter={setSelectedFilter}
                            showFilterSelectedLabel={tableUiConfig.showFilterSelectedLabel}
                            searchTerm={searchTerm}
                            minSearchCharacters={tableUiConfig.minSearchCharacters}
                            setSearchTerm={setSearchTerm}
                            isCalendar={tableUiConfig.isCalendar}
                            dateHandler={dateHandlerCallback}
                            onDeleteCallback={() => {
                                setDeleteDialogShow(true);
                            }}
                            customActions={tableUiConfig.customActions}
                            onActionCallback={(buttonId) => {
                                onActionCallback(selected, buttonId);
                            }}
                        />
                    )}
                    {data.length > 0 ? (
                        <TableContainer sx={{ border: 0.5, borderColor: 'black' }}>
                            {isLoading ? (
                                <TableLoading />
                            ) : isError ? (
                                <>
                                    <ServerError onCallback={onRetryCallback} />
                                </>
                            ) : (
                                <>
                                    <Table
                                        sx={{ minWidth: 750 }}
                                        aria-labelledby="tableTitle"
                                        size={tableUiConfig.isTableDense ? 'small' : 'medium'}
                                    >
                                        <EnhancedTableHead
                                            numSelected={selected.length}
                                            order={order}
                                            orderBy={orderBy}
                                            onSelectAllClick={handleSelectAllClick}
                                            onRequestSort={handleRequestSort}
                                            rowCount={data.length}
                                            headCells={headCells}
                                            isActions={tableUiConfig.isActionEdit}
                                            isViewOnly={tableUiConfig.viewOnly}
                                        />

                                        <TableBody>
                                            {tableUiConfig.enablePagination
                                                ? stableSort(data, getComparator(order, orderBy))
                                                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                      .map((row, index) => {
                                                          const isItemSelected = isSelected(row.id);
                                                          const labelId = `enhanced-table-checkbox-${index}`;
                                                          return TableBodyContent(row, isItemSelected, labelId);
                                                      })
                                                : stableSort(data, getComparator(order, orderBy)).map((row, index) => {
                                                      const isItemSelected = isSelected(row.id);
                                                      const labelId = `enhanced-table-checkbox-${index}`;
                                                      return TableBodyContent(row, isItemSelected, labelId);
                                                  })}

                                            {emptyRows > 0 && (
                                                <TableRow
                                                    style={{
                                                        height: 53 * emptyRows
                                                    }}
                                                >
                                                    <TableCell colSpan={6} />
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </>
                            )}
                        </TableContainer>
                    ) : (
                        <Card variant="outlined" sx={{}}>
                            <CardContent
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    flexDirection: 'column',
                                    alignItems: 'center'
                                }}
                            >
                                <img src={NoDataImage} alt="no-data-logo" width={100} />
                                <Typography variant="h4" fontWeight={400} component="div" sx={{ mt: 2 }}>
                                    {tableUiConfig.noDataMessage}
                                </Typography>
                            </CardContent>
                        </Card>
                    )}
                    {tableConfig.enableExternalPagination && externalPaginationRender()}
                    {tableUiConfig.enablePagination && (
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={data.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            sx={{
                                visibility: tableUiConfig.enablePagination ? 'visible' : 'hidden'
                            }}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    )}
                </>
                {/* )} */}
            </Paper>

            {isCustomDeleteDialog && (
                <DeleteDialogConfirmation
                    deleteCallback={() => {
                        onDeleteClickCallback(selected);
                        setDeleteDialogShow(false);
                    }}
                    cancelCallback={() => {
                        setDeleteDialogShow(false);
                    }}
                    showDeleteConfirmation={isDeleteDialogShow}
                />
            )}
        </Box>
    );
};

export default MuiDynaTable;
