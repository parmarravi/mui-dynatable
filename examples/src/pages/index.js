import { MuiDynaTable } from '../../../src/index';
import React, { useState } from 'react';

function index() {
    const [isTableLoading, setTableLoading] = useState(false);
    const [isServerError, setIsServerError] = useState(false);

    const tableConfig = {};

    const quotationList = [];

    const callRetry = () => {};

    return (
        <div>
            <MuiDynaTable
                data={quotationList}
                headCells={QuotationTableConfig.headCells}
                tableConfig={tableConfig}
                isError={isServerError}
                isLoading={isTableLoading}
                onRetryCallback={callRetry}
                onRefreshCallback={() => {
                    // setPage(0);
                    // setSearchText('');
                    // fetchQuotationsApproval();
                }}
                handleSingleRowClick={(key, rowData) => {
                    // if (key === 'seller_name') {
                    //     setUserStatusLoading(false);
                    //     showQuotationData(rowData);
                    // }
                }}
                handleSearchChange={(val) => {
                    //setSearchText(val);
                }}
                onFilterOptionCallback={(data) => {
                    // setPage(0);
                    // setSearchText('');
                    // if (data.id === config.userStatus.pending) {
                    //     setTableConfig((val) => ({ ...val, viewOnly: false }));
                    // } else {
                    //     setTableConfig((val) => ({ ...val, viewOnly: true }));
                    // }
                    // setUserStatusSelected(data.id);
                }}
                onActionCallback={(selectedIds, actionId) => {
                    // setSelectedButtonAction(actionId);
                    // setSelectedIds(selectedIds);
                }}
                // externalPaginationRender={() => {
                //     return (
                //         <TablePagination
                //             rowsPerPageOptions={[5, 25, 50, 100]}
                //             component="div"
                //             count={maxDataLength}
                //             rowsPerPage={rowsPerPage}
                //             page={page}
                //             onPageChange={handleChangePage}
                //             onRowsPerPageChange={handleChangeRowsPerPage}
                //         />
                //     );
                // }}
            />
        </div>
    );
}

export default index;
