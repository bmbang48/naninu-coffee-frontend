export const formatCurrency = (value: string | number) => {
    if(!value) return '';
    const numberString = value.toString().replace(/\D/g, '');
    const formatted = numberString.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return `Rp ${formatted}`;
};

export const unformatCurrency = (formattedValue: string) => {
    return formattedValue.replace(/\D/g, '');
};

export const formatNumber = (value: string | number)=>{
        if(!value) return '';
        const numberString = value.toString().replace(/\D/g, '');
        const formatted = numberString.replace(/\B(?=(\d{3})+(?!\d))/g, '');
        return `${formatted}`; // Assuming Indonesian Rupiah
    };

export const formatLocalDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
};