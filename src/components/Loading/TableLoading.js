import { Paper, Skeleton, Table, TableBody, TableCell, TableRow, Toolbar } from '@mui/material';
import React from 'react';

/**
 * Renders a loading state for a table.
 * Shows a toolbar with a skeleton text element and a table body with skeleton rows/cells.
 */
function TableLoading() {
    return (
        <Paper>
            <Toolbar
                sx={{
                    pl: { sm: 2 },
                    pr: { xs: 1, sm: 1 }
                }}
            >
                <Skeleton variant="text" sx={{ height: 40, flex: '1 1 100%' }} />
            </Toolbar>
            <Table>
                <TableBody>
                    {Array.from(new Array(5)).map((_, index) => (
                        <TableRow key={index}>
                            {Array.from(new Array(6)).map((_, index) => (
                                <TableCell key={index}>
                                    <Skeleton variant="text" />
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Paper>
    );
}

export default TableLoading;
