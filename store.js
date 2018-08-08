
export const fallbackImage = {
    'src': require('./assets/image_fallback.jpg'),
    'size': 633356 //bytes
}

export const videos = {
    'mp4': {
        '640': {
            1:  require('./assets/mp4/matte_640_1MB.mp4'),
        },
        '1280': {
            2:  require('./assets/mp4/matte_1280_2MB.mp4'),
            3:  require('./assets/mp4/matte_1280_3MB.mp4'),
            5:  require('./assets/mp4/matte_1280_5MB.mp4'),
            8:  require('./assets/mp4/matte_1280_8MB.mp4'),
            10:  require('./assets/mp4/matte_1280_10MB.mp4'),
            12:  require('./assets/mp4/matte_1280_12MB.mp4')
        }
    },
    'webm': {
        '640': {
            1:  require('./assets/webm/matte_640_1MB.webm'),
        },
        '1280': {
            1:  require('./assets/webm/matte_1280_1MB.webm'),
            2:  require('./assets/webm/matte_1280_2MB.webm'),
            3:  require('./assets/webm/matte_1280_3MB.webm'),
            5:  require('./assets/webm/matte_1280_5MB.webm'),
            8:  require('./assets/webm/matte_1280_8MB.webm')
        }
    } 
}