/**
 * Utility to export data to CSV format
 */
export function exportToCSV(data: any[], filename: string, headers: Record<string, string>) {
    if (!data || data.length === 0) return;

    // Header row
    const headerKeys = Object.keys(headers);
    const headerLabels = Object.values(headers);
    
    const csvRows = [];
    csvRows.push(headerLabels.join(','));

    // Data rows
    for (const row of data) {
        const values = headerKeys.map(key => {
            const val = row[key];
            // Format values for CSV (handle commas, quotes, etc)
            const escaped = ('' + val).replace(/"/g, '""');
            return `"${escaped}"`;
        });
        csvRows.push(values.join(','));
    }

    // Create blob and download
    const csvString = csvRows.join('\n');
    const blob = new Blob(['\ufeff' + csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

/**
 * Utility to trigger browser print dialog (useful for Save as PDF)
 */
export function exportToPDF() {
    window.print();
}
