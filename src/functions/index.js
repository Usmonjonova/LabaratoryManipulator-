
export function sortAndCount(input) {
    if (!input) return [];  // Handle empty input

    let result = [];
    let count = 1;

    for (let i = 0; i < input.length; i++) {
        if (input[i] === input[i + 1]) {
            count++;
        } else {
            result.push([count.toString(), input[i]]);
            count = 1;
        }
    }

    console.log(result);  // Debugging output
    return result;
}


export function generateOriginal(arr) {
    let result = '';
    console.log('Input array:', arr, typeof arr); // Debugging the type and value of input

    if (!Array.isArray(arr)) {
        console.error('Expected an array but got:', typeof arr);
        return '';  // Return an empty string or handle the error as needed
    }

    arr.forEach(([count, char]) => {
        if (isNaN(count) || !char) {
            console.warn('Invalid entry:', count, char);  // Handle invalid entries
            return;
        }
        result += char.repeat(parseInt(count));
    });

    return result;
}




export function generateOptimized(arr) {
    let result = '';

    arr.forEach(([count, char]) => {
        result += `${count}${char}`;
    });

    return result;
}


export function formatDateTime() {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${day}/${month}/${year}, ${hours}:${minutes}:${seconds}`;
}

console.log(formatDateTime());
