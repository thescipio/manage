export function formatDate(isoString) {
    const date = new Date(isoString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}