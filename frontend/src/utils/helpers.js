import axios from 'axios';
axios.defaults.headers.common['g_csrf_token'] = getCookie('g_csrf_token') || getCookie('csrftoken');
axios.defaults.headers.common['X-CSRFToken'] = getCookie('g_csrf_token') || getCookie('csrftoken');

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

export { getCookie, axios }