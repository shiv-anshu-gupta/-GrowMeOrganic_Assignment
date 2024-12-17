// src/App.tsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

interface Artwork {
  id: number;
  title: string;
  place_of_origin: string;
  artist_display: string;
  inscriptions: string;
  date_start: number;
  date_end: number;
}

const App: React.FC = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchArtworks(currentPage);
  }, [currentPage]);

  const fetchArtworks = async (page: number) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.artic.edu/api/v1/artworks?page=${page}`
      );
      setArtworks(
        response.data.data.map((item: any) => ({
          id: item.id,
          title: item.title || "Unknown",
          place_of_origin: item.place_of_origin || "Unknown",
          artist_display: item.artist_display || "Unknown",
          inscriptions: item.inscriptions || "N/A",
          date_start: item.date_start || 0,
          date_end: item.date_end || 0,
        }))
      );
      setTotalRecords(response.data.pagination.total);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const onPageChange = (event: any) => {
    setCurrentPage(event.page + 1);
  };

  return (
    <div className="p-m-4">
      <h2>Artworks</h2>
      <DataTable
        value={artworks}
        paginator
        rows={10}
        lazy
        totalRecords={totalRecords}
        loading={loading}
        onPage={onPageChange}
      >
        <Column field="title" header="Title" />
        <Column field="place_of_origin" header="Place of Origin" />
        <Column field="artist_display" header="Artist" />
        <Column field="inscriptions" header="Inscriptions" />
        <Column field="date_start" header="Date Start" />
        <Column field="date_end" header="Date End" />
      </DataTable>
    </div>
  );
};

export default App;
