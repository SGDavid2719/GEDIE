if(isset($_POST['submitClientEdition'])) 
{
    unset($_POST['submit-track-info']);

    $lNewData = $_POST;
    $lResult = EditData('client', $lNewData, $lCondition, $_SESSION['roleno']);

    unset($_POST);

    if ($lResult == false) 
    {
        $lClientNo = ($_SESSION['role'] == 'Client') ? $_SESSION['roleno'] : $_SESSION['clientno'];
        $lDescription = 'Error editing client: ' . $lClientNo;
        InsertWarning('log', 'client', 'ERROR', 'EDIT', $lDescription, $_SESSION['roleno']);
    }

    if ($_SESSION['role'] == 'Client') 
    {
        unset($_SESSION['clientno']);
        Redirect('../VIEWS/CLIENT/All_DetailClient.php', false); 
    }  
    else Redirect('../VIEWS/CLIENT/All_ListClients.php', false); 
}