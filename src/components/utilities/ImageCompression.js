export const imageCompression = (fileRef, previewRef) => {
  const file = fileRef.current.files[0];

  if (!file) return;
  const reader = new FileReader();

  reader.readAsDataURL(file);

  reader.onload = function (event) {
    const imgele = document.createElement("img");
    imgele.src = event.target.result;
    imgele.onload = function (e) {
      const canvas = document.createElement("canvas");
      const max_width = 300;
      const scale = max_width / e.target.width;
      canvas.width = max_width;
      canvas.height = scale * e.target.height;

      const ctx = canvas.getContext("2d");

      ctx.drawImage(e.target, 0, 0, canvas.width, canvas.height);
      const srcEncoded = ctx.canvas.toDataURL(e.target, "image/jpeg");
      previewRef.current.src = srcEncoded;
      previewRef.current.style.display = "block";
    };
  };
};
