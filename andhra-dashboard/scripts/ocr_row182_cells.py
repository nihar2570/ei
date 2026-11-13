import asyncio, cv2, glob, os
import numpy as np
from PIL import Image
from winsdk.windows.media.ocr import OcrEngine
from winsdk.windows.graphics.imaging import SoftwareBitmap, BitmapPixelFormat, BitmapAlphaMode
from winsdk.windows.security.cryptography import CryptographicBuffer

async def ocr_img(pil_img, engine):
    im = pil_img.convert('L')
    buf = CryptographicBuffer.create_from_byte_array(im.tobytes())
    sbmp = SoftwareBitmap.create_copy_from_buffer(buf, BitmapPixelFormat.GRAY8, im.width, im.height, BitmapAlphaMode.IGNORE)
    res = await engine.recognize_async(sbmp)
    return ' '.join(l.text for l in res.lines).strip()

async def main():
    engine = OcrEngine.try_create_from_user_profile_languages()
    for i in range(16):
        fn = f'cells_182/col_{i:02d}.png'
        if not os.path.exists(fn):
            continue
        im = cv2.imread(fn, cv2.IMREAD_GRAYSCALE)
        trim = im[5:-5, 5:-5]
        padded = cv2.copyMakeBorder(trim, 40, 40, 40, 40, cv2.BORDER_CONSTANT, value=255)
        up = cv2.resize(padded, (padded.shape[1]*3, padded.shape[0]*3), interpolation=cv2.INTER_CUBIC)
        txt = await ocr_img(Image.fromarray(up), engine)
        print(f'Col {i:02d}: "{txt}"')

if __name__ == '__main__':
    asyncio.run(main())
