export default function AttachmentPreviewView({ attachment, onDismiss }) {
  if (attachment.mimeType.startsWith('image/')) {
    const objectURL = URL.createObjectURL(
      new Blob([Buffer.from(attachment.data)], {
        type: attachment.mimeType
      })
    );

    return (
      <div>
        <img src={objectURL} height={100} />
        <div>
          <small>
            {attachment.filename}{' '}
            <button type="button" onClick={onDismiss}>
              Remove
            </button>
          </small>
        </div>
      </div>
    );
  }

  return <div>{attachment.filename}</div>;
}
