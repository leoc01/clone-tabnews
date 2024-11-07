function status(request, response) {
  response.status(200).json({ chave: "são legais" });
}

export default status;
