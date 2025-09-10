import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const trainData = [
  {
    id: "TR-001",
    status: "Ready",
    mileage: "145,230",
    lastMaintenance: "2024-01-15",
    nextService: "2024-02-15",
  },
  {
    id: "TR-002",
    status: "Maintenance",
    mileage: "189,450",
    lastMaintenance: "2024-01-10",
    nextService: "2024-01-25",
  },
  {
    id: "TR-003",
    status: "Standby",
    mileage: "132,890",
    lastMaintenance: "2024-01-12",
    nextService: "2024-02-10",
  },
  {
    id: "TR-004",
    status: "Ready",
    mileage: "167,340",
    lastMaintenance: "2024-01-08",
    nextService: "2024-02-05",
  },
  {
    id: "TR-005",
    status: "Ready",
    mileage: "201,120",
    lastMaintenance: "2024-01-14",
    nextService: "2024-02-20",
  },
  {
    id: "TR-006",
    status: "Out of Service",
    mileage: "178,990",
    lastMaintenance: "2024-01-01",
    nextService: "2024-01-30",
  },
];

const getStatusVariant = (status: string) => {
  switch (status) {
    case "Ready":
      return "bg-success text-success-foreground";
    case "Maintenance":
      return "bg-warning text-warning-foreground";
    case "Standby":
      return "bg-secondary text-secondary-foreground";
    case "Out of Service":
      return "bg-destructive text-destructive-foreground";
    default:
      return "bg-muted text-muted-foreground";
  }
};

export function TrainStatusTable() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTrains = trainData.filter((train) =>
    train.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    train.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="border-0 shadow-md">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold">Train Fleet Status</CardTitle>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search trains..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold">Train ID</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Mileage</TableHead>
                <TableHead className="font-semibold">Last Maintenance</TableHead>
                <TableHead className="font-semibold">Next Service</TableHead>
                <TableHead className="font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTrains.map((train) => (
                <TableRow
                  key={train.id}
                  className="hover:bg-muted/50 transition-colors"
                >
                  <TableCell className="font-medium">{train.id}</TableCell>
                  <TableCell>
                    <Badge className={getStatusVariant(train.status)}>
                      {train.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{train.mileage} mi</TableCell>
                  <TableCell>{train.lastMaintenance}</TableCell>
                  <TableCell>{train.nextService}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      className="hover:bg-accent hover:text-accent-foreground"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}