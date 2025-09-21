const ImportData = () => {
  return (
    <Dialog
      open={open === "import-data"}
      onOpenChange={(isOpen) => {
        if (!isOpen) setOpen(null);
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Import Data</DialogTitle>
          <DialogDescription>
            Import data from CSV, JSON, or other formats.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Import functionality will be implemented here.
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" disabled>
              <FileText className="mr-2 h-4 w-4" />
              CSV File
            </Button>
            <Button variant="outline" disabled>
              <FileText className="mr-2 h-4 w-4" />
              JSON File
            </Button>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(null)}>
            Cancel
          </Button>
          <Button disabled>Import</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImportData;
