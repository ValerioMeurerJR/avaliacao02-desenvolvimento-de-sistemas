import "./styles.css"
import { DataGrid } from '@mui/x-data-grid';
import Box from '@mui/material/Box';


type Produto = {
    "id": string,
    "text": string,
    "checked": boolean
}

type ListaProps = {
    produtos: Produto[],
    handleUpdateItem: (event: any, id: string, value: string) => void;
    columns: any;
}

export default function Lista({ produtos, handleUpdateItem, columns }: ListaProps) {

    return (
        <div>
            <h1>Lista de produtos</h1>
            <Box sx={{ height: 400, width: '100%' }}>
                <DataGrid
                    rows={produtos}
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: {
                                pageSize: 5,
                            },
                        },
                    }}
                    pageSizeOptions={[5]}
                />
            </Box>
        </div>
    )
}