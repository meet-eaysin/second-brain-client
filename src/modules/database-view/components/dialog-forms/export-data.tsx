const ExportData = () => {
  return (
    <Dialog
      open={open === "export-data"}
      onOpenChange={(isOpen) => {
        if (!isOpen) setOpen(null);
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Export Data</DialogTitle>
          <DialogDescription>
            Export your data in various formats.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Export functionality will be implemented here.
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" disabled>
              <FileText className="mr-2 h-4 w-4" />
              CSV Format
            </Button>
            <Button variant="outline" disabled>
              <FileText className="mr-2 h-4 w-4" />
              JSON Format
            </Button>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(null)}>
            Cancel
          </Button>
          <Button disabled>Export</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExportData;
