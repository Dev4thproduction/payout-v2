import { useCallback } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import { toast } from 'react-toastify';

const usePrintPDF = () => {
  const printPDF = useCallback(async (taskData) => {
    if (!taskData) {
      toast.error('No task data available');
      return;
    }

    if (taskData.type === 'Residence') {
      try {
        const response = await axios.get(
          `https://pro.golog.tech/api/tasks/download/${taskData._id}`,
          { responseType: 'blob' }
        );
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${taskData.taskID}.pdf`);
        document.body.appendChild(link);
        link.click();
      } catch (error) {
        toast.error(
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
          {
            hideProgressBar: true,
            autoClose: 2000,
          }
        );
      }
    } else {
      const report = new jsPDF('portrait', 'pt', 'a4');
      let reportDiv = document.querySelector('#report');
      if (reportDiv) {
        reportDiv.style.display = 'flex';
        await report.html(reportDiv);
        report.save(`${taskData.taskID}.pdf`);
        reportDiv.style.display = 'none';
      } else {
        toast.error('Report element not found');
      }
    }
  }, []);

  return printPDF;
};

export default usePrintPDF;