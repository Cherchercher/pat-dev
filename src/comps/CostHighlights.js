import React, { PureComponent } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

function createData(item, cost) {
  return { item, cost };
}

class CostHighlights extends PureComponent {
  render() {
    const rows = [];
    console.log(this.props.highlights);
    this.props.highlights.data.map(item => {
      rows.push(createData(item.description, item.cost));
    });
    return (
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Item</TableCell>
              <TableCell align="right">Cost</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(row => (
              <TableRow key={row.item}>
                <TableCell
                  component="th"
                  scope="row"
                  style={{ fontSize: "13px" }}
                >
                  {row.item}
                </TableCell>
                <TableCell style={{ fontSize: "13px" }} align="right">
                  {row.cost}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    );
  }
}

export default CostHighlights;
