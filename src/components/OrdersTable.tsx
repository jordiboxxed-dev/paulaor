import { Order } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

interface OrdersTableProps {
  orders: Order[];
  onViewDetails: (order: Order) => void;
}

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'paid':
      return 'default';
    case 'pending':
      return 'secondary';
    case 'shipped':
      return 'outline';
    default:
      return 'destructive';
  }
};

const OrdersTable = ({ orders, onViewDetails }: OrdersTableProps) => {
  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Fecha</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="w-[120px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{format(new Date(order.created_at), 'dd/MM/yyyy HH:mm')}</TableCell>
              <TableCell>
                <div className="font-medium">{order.customer_name}</div>
                <div className="text-sm text-muted-foreground">{order.customer_email}</div>
              </TableCell>
              <TableCell>${order.total_price.toFixed(2)}</TableCell>
              <TableCell>
                <Badge variant={getStatusVariant(order.status)}>{order.status}</Badge>
              </TableCell>
              <TableCell>
                <Button variant="outline" size="sm" onClick={() => onViewDetails(order)}>
                  Ver Detalles
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default OrdersTable;