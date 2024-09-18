import { useState, useEffect, useRef, FormEvent } from "react";

import "primeicons/primeicons.css";

import { Column } from "primereact/column";
import { TreeNode } from "primereact/treenode";

import { OverlayPanel } from "primereact/overlaypanel";

import { DataTable } from "primereact/datatable";
import axios from "axios";
import { Paginator } from "primereact/paginator";
import { Button } from "primereact/button";

export default function CheckboxRowSelectionDemo() {
  const [nodes, setNodes] = useState<TreeNode[]>([]);
  const [selectedNodeKeys, setSelectedNodeKeys] =
    useState<TreeNode[] | null>(null);
  const [first, setFirst] = useState<number>(0);
  const [rowClick, setRowClick] = useState<boolean>(true);
  const [rows, setRows] = useState<number>(6);
  const [pageNo, setPageNo] = useState<number>(1);
  const [rowSelectionCount, setRowSelectionCount] = useState(0);
  const op = useRef<OverlayPanel>(null);

  useEffect(() => {
    async function getData() {
      const response = await axios.get(
        `https://api.artic.edu/api/v1/artworks?page=${pageNo}`
      );
      const data = response.data;
      setNodes(data.data);
    }
    getData();
  }, [pageNo]);

  const handleSelection = (n: number) => {
    const rowSelect = [];
    for (let i = 0; i < n; i++) {
      rowSelect.push(nodes[i]);
    }
    setSelectedNodeKeys(rowSelect);
  };

  const onPageChange = (event: {
    page: number;
    first: number;
    rows: number;
  }) => {
    setPageNo(event.page + 1);
    setFirst(event.first);
    setRows(event.rows);
    const n = rowSelectionCount - event.page * 12;
    if (n > 0) {
      handleSelection(n);
    }
  };

  const RowNoInput = (e) => {
    setSelectedNodeKeys(e.value);
    setRowClick(!rowClick);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const n: number = parseInt(e.target[0].value);
    setRowSelectionCount(n);
    handleSelection(n);
  };

  return (
    <div className="card">
      <DataTable
        value={nodes}
        selectionMode={rowClick ? "undefined" : "multiple"}
        selection={selectedNodeKeys}
        tableStyle={{ minWidth: "50rem" }}
        onSelectionChange={(e: FormEvent<Element>) => RowNoInput(e)}
        dataKey="id"
      >
        <Column
          selectionMode="multiple"
          headerStyle={{ width: "3rem" }}
        ></Column>
        <Column
          header={() => (
            <>
              <i
                className="pi pi-angle-down"
                style={{ fontSize: "1.7rem" }}
                onClick={(e) => op.current?.toggle(e)}
              />
              <OverlayPanel ref={op}>
                <form
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "200px",
                  }}
                  onSubmit={(e) => handleFormSubmit(e)}
                >
                  <input
                    type="text"
                    placeholder="select rows.."
                    style={{
                      height: "3rem",
                      borderRadius: "5px",
                      borderStyle: "outset",
                      marginBottom: "10px",
                    }}
                    onChange={(e) => {
                      RowNoInput(e);
                    }}
                  />
                  <Button
                    type="submit"
                    style={{
                      background: "white",
                      color: "black",
                      height: "38px",
                      width: "85px",
                      marginLeft: "auto",
                      justifyContent: "center",
                    }}
                    onClick={(e) => op.current?.toggle(e)}
                  >
                    submit
                  </Button>
                </form>
              </OverlayPanel>
            </>
          )}
        />
        <Column field="place_of_origin" header="Place Of Origin"></Column>
        <Column field="artist_display" header="Artist Display"></Column>
        <Column field="inscriptions" header="Inscriptions"></Column>
        <Column field="date_start" header="Start Date"></Column>
        <Column field="date_end" header="End Date"></Column>
      </DataTable>
      <Paginator
        first={first}
        rows={rows}
        totalRecords={120}
        onPageChange={onPageChange}
      />
    </div>
  );
}
